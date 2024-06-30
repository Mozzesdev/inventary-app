import app from "../server/index.js";
import { PORT } from "../server/config.js";

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
