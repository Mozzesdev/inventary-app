import jwt from "jsonwebtoken";
import getConnection from "../../db/mysql.js";
import { ATTEMPT_TIMEOUT, JSW_KEY, MAX_ATTEMPTS } from "../../../config.js";
import * as OTPAuth from "otpauth";
import { toDataURL } from "qrcode";
import { generateBase32Secret } from "../../utils.js";
import { User } from "../../interface/user.js";
import { RedisClientType } from "redis";
import redis from "../../../redis/config.js";
import scrypt from "../../../scrypt.js";

class UserModel {
  redis: RedisClientType;

  constructor({ redis }) {
    this.redis = redis;
  }

  async getAll({ email }: { email?: string }) {
    let query = "SELECT *, BIN_TO_UUID(id) as id FROM users";
    const params: any[] = [];

    if (email) {
      query += " WHERE email LIKE ?";
      params.push(`%${email}%`);
    }

    query += ";";

    try {
      const mysqlConnection = await getConnection();
      const [users] = await mysqlConnection.query(query, params);

      const roleQuery =
        "SELECT *, BIN_TO_UUID(id) as id FROM roles WHERE id = ?";

      const userPromises = (users as []).map(
        async ({
          role_id,
          email,
          two_factor,
          id,
          created_at,
          root_user,
        }: any) => {
          const [role] = await mysqlConnection.query(roleQuery, [role_id]);
          return {
            email,
            id,
            created_at,
            two_factor,
            role: (role as []).length ? role[0] : null,
            root_user: !!root_user,
          };
        }
      );

      const filteredUsers = await Promise.all(userPromises);

      return {
        success: true,
        data: filteredUsers,
        message: "Success",
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        success: false,
        message: "Error fetching users",
        statusCode: 500,
      };
    }
  }

  async getById({ id }: { id: string }) {
    try {
      const mysqlConnection = await getConnection();
      const [rows] = await mysqlConnection.query(
        "SELECT *, BIN_TO_UUID(id) as id FROM users WHERE id = UUID_TO_BIN(?);",
        [id]
      );

      if ((rows as []).length === 0) {
        return { success: false, message: "User not found", statusCode: 404 };
      }

      const user: User = rows[0];

      const [role] = await mysqlConnection.query(
        "SELECT *, BIN_TO_UUID(id) as id FROM roles WHERE id = ?;",
        [user.role_id]
      );

      return {
        success: true,
        data: {
          email: user.email,
          id: user.id,
          app_secret: !!user.app_secret,
          two_factor: user.two_factor,
          root_user: !!user.root_user,
          role: (role as [])?.length ? role[0] : undefined,
        },
        statusCode: 200,
        message: "User found",
      };
    } catch (error: any) {
      console.error("Error fetching user by id:", error.message || error);
      return {
        success: false,
        message: "Error fetching user by id",
        statusCode: 500,
      };
    }
  }

  async create({ input }: { input: User | any }) {
    const { email, password, role_id, root_user } = input;

    try {
      const hash = await scrypt.hash(password);
      const mysqlConnection = await getConnection();
      const [existingUser]: any = await mysqlConnection.query(
        "SELECT email FROM users WHERE email = ?;",
        [email]
      );

      if (existingUser?.length) {
        return {
          success: false,
          message: "Email is already in use",
          statusCode: 409,
        };
      }

      const [uuidResult]: any = await mysqlConnection.query(
        "SELECT UUID() AS uuid;"
      );
      const [{ uuid }] = uuidResult;
      await mysqlConnection.query(
        `INSERT INTO users (id, email, password, role_id, root_user) VALUES (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?), ?);`,
        [uuid, email, hash, role_id, root_user]
      );
      const [users]: any = await mysqlConnection.query(
        "SELECT *, BIN_TO_UUID(id) as id FROM users WHERE id = UUID_TO_BIN(?);",
        [uuid]
      );
      return { success: true, data: users[0], statusCode: 200 };
    } catch (error) {
      console.error("Error creating user:", error);
      return {
        success: false,
        message: "Error creating user",
        statusCode: 500,
      };
    }
  }

  async delete({ id }) {
    try {
      const mysqlConnection = await getConnection();

      const [rows] = await mysqlConnection.query(
        "SELECT root_user FROM users WHERE id = UUID_TO_BIN(?)",
        [id]
      );

      if (!(rows as [])?.length) {
        return {
          success: false,
          message: "User not found",
          statusCode: 404,
        };
      }

      const user = rows[0];

      if (user.root_user) {
        return {
          success: false,
          message: "Cannot delete master user",
          statusCode: 403,
        };
      }

      await mysqlConnection.query(
        "DELETE FROM users WHERE id = UUID_TO_BIN(?)",
        [id]
      );

      return {
        success: true,
        message: "User deleted successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      return {
        success: false,
        message: "Error deleting user",
        statusCode: 500,
      };
    }
  }

  async update({ id, input }: any) {
    try {
      const mysqlConnection = await getConnection();
      const updateFields: string[] = [];
      const fieldValues: any[] = [];

      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
          if (key === "password") {
            const hashedPassword = await scrypt.hash(input[key]);
            updateFields.push(`${key} = ?`);
            fieldValues.push(hashedPassword);
          } else if (key === "role_id") {
            updateFields.push(`${key} = UUID_TO_BIN(?)`);
            fieldValues.push(input[key]);
          } else {
            updateFields.push(`${key} = ?`);
            fieldValues.push(input[key]);
          }
        }
      }

      fieldValues.push(id);

      const sqlQuery = `UPDATE users SET ${updateFields.join(
        ", "
      )} WHERE id = UUID_TO_BIN(?);`;

      await mysqlConnection.query(sqlQuery, fieldValues);

      return { success: true, statusCode: 200, message: "Updated succesful" };
    } catch (error) {
      console.error("Error updating user:", error);
      return {
        success: false,
        message: "Error updating user",
        statusCode: 500,
      };
    }
  }

  async login({ input }: any) {
    const mysqlConnection = await getConnection();
    const [userQuery]: any = await mysqlConnection.query(
      "SELECT *, BIN_TO_UUID(id) as id FROM users WHERE email = ?",
      [input.email]
    );
    if (!userQuery.length)
      return {
        success: false,
        status: 404,
        message: "User not found",
      };
    const [{ password, email, id, two_factor }]: User[] = userQuery;
    const match = await scrypt.compare(input.password, password);
    if (match) {
      const token = jwt.sign({ id }, JSW_KEY as string, {
        expiresIn: "1h",
      });
      await this.redis.set(`${id}:attempts`, 0, {
        EX: +ATTEMPT_TIMEOUT,
        NX: true,
      });
      return {
        success: true,
        data: { email, id, two_factor, token },
        status: 200,
        message: "Login succesfull",
      };
    }
    return {
      success: false,
      message: "Credentials are not correct",
      status: 401,
    };
  }

  async changePassword({ input, id }: any) {
    try {
      const mysqlConnection = await getConnection();
      const [rows] = await mysqlConnection.query(
        "SELECT *, BIN_TO_UUID(id) as id FROM users WHERE id = UUID_TO_BIN(?);",
        [id]
      );
      if ((rows as []).length === 0) {
        return { success: false, message: "User not found", statusCode: 404 };
      }
      const [user] = rows as any[];
      const match = await scrypt.compare(input.current, user.password);
      if (!match) {
        return {
          success: false,
          message: "The current password provided is not correct",
          statusCode: 400,
        };
      }
      const hash = await scrypt.hash(input.new);
      await mysqlConnection.query(
        "UPDATE users SET password = ? WHERE id = UUID_TO_BIN(?);",
        [hash, id]
      );
      return {
        success: true,
        message: "Password changed succesfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        succes: false,
        message: "Error changing the password",
        statusCode: 500,
      };
    }
  }

  async enable2fa({ id }) {
    try {
      const { statusCode, message, data: user } = await this.getById({ id });

      if (!user) {
        return { message, success: false, statusCode };
      }

      const app_secret = generateBase32Secret();

      const { statusCode: status } = await this.update({
        id,
        input: { app_secret, two_factor: true },
      });

      if (status === 200) {
        const totp = new OTPAuth.TOTP({
          issuer: "InventaryApp",
          label: user.email,
          algorithm: "SHA1",
          digits: 6,
          secret: app_secret,
        });

        const otpauth_url = totp.toString();
        try {
          const qrUrl = await toDataURL(otpauth_url);

          await this.redis.set(`${user?.id}:attempts`, 0, {
            EX: +ATTEMPT_TIMEOUT,
          });

          return {
            statusCode: 200,
            data: {
              qrCodeUrl: qrUrl,
              uri: otpauth_url,
            },
            message: "Enabled 2FA succesfull",
          };
        } catch (error) {
          return {
            success: false,
            message: "Error while generating QR Code",
            statusCode: 500,
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Error when enabling 2FA",
        statusCode: 500,
      };
    }
  }

  async verify2fa({ id, token_2fa }) {
    const mysqlConnection = await getConnection();
    const [rows] = await mysqlConnection.query(
      "SELECT *, BIN_TO_UUID(id) as id FROM users WHERE id = UUID_TO_BIN(?);",
      [id]
    );

    if ((rows as []).length === 0) {
      return { success: false, message: "User not found", statusCode: 404 };
    }

    const user: User = rows[0];
    const now = Date.now();

    const blockedUntil = await this.redis.get(`${id}:blockedUntil`);

    if (blockedUntil && now < +blockedUntil) {
      return {
        message: "Your account is blocked. Please try again later.",
        success: false,
        statusCode: 403,
      };
    }
    let attempts = +((await this.redis.get(`${id}:attempts`)) || 0);

    const secret = user.app_secret;

    const totp = new OTPAuth.TOTP({
      issuer: "InventaryApp",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      secret: secret,
    });

    const delta = totp.validate({ token: token_2fa, window: 1 });

    if (delta === null) {
      attempts += 1;
      await this.redis.set(`${id}:attempts`, attempts, {
        EX: +ATTEMPT_TIMEOUT,
      });

      if (attempts >= +MAX_ATTEMPTS) {
        await this.redis.set(`${id}:blockedUntil`, now + +ATTEMPT_TIMEOUT);
        await this.redis.del(`${id}:attempts`);

        return {
          message: "Too many attempts. Please try again later.",
          success: false,
          statusCode: 403,
        };
      }
      return {
        success: false,
        message: "Invalid 2FA code",
        statusCode: 403,
      };
    }

    await this.redis.del(`${id}:attempts`);
    await this.redis.del(`${id}:blockedUntil`);

    const token = jwt.sign({ id }, JSW_KEY as string, {
      expiresIn: "1h",
    });

    return {
      success: true,
      message: "Authentication successful",
      data: { token },
      statusCode: 200,
    };
  }
}

const userModel = new UserModel({ redis });

export default userModel;
