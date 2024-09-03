import request from "supertest";
import app from "../..";
import getMysqlPool from "../api/db/mysql";

jest.mock("../api/db/mysql");

describe("API Tests", () => {
  const mockUsers = [
    {
      id: "1",
      email: "test@example.com",
      created_at: "2024-01-01T00:00:00Z",
      two_factor: false,
      role_id: "1",
      root_user: 0,
    },
  ];

  beforeEach(() => {
    // Reinicia los mocks antes de cada test
    jest.clearAllMocks();
  });

  test("GET /user should return all collections of users from the MySQL database", async () => {
    const mockQuery = jest.fn().mockResolvedValue([mockUsers]);
    (getMysqlPool as jest.Mock).mockReturnValue({
      query: mockQuery,
    });

    const response = await request(app).get("/api/user");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          email: expect.any(String),
          created_at: expect.any(String),
          two_factor: expect.any(Boolean),
          role: expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          }),
          root_user: expect.any(Boolean),
        }),
      ]),
      message: "Success",
      statusCode: 200,
    });

    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT *, BIN_TO_UUID(id) as id FROM users;",
      []
    );
  });

  test("GET /user should handle database errors gracefully", async () => {
    const mockQuery = jest.fn().mockRejectedValue(new Error("Database error"));
    (getMysqlPool as jest.Mock).mockReturnValue({
      query: mockQuery,
    });

    const response = await request(app).get("/api/user");

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: "Error fetching users",
      statusCode: 500,
    });
  });
});
