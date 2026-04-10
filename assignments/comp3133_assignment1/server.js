const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

const connectDB = require("./config/db");
const schema = require("./schemas");
const { getUserFromAuthHeader } = require("./utils/auth");
const { uploadToCloudinary } = require("./utils/cloudinary");

dotenv.config();

async function start() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const upload = multer({ storage: multer.memoryStorage() });

  app.post("/upload", upload.single("photo"), async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded (field name must be 'photo')." });
      }

      const result = await uploadToCloudinary(req.file);

      return res.json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Upload failed",
        error: err.message,
      });
    }
  });

  const apolloServer = new ApolloServer({
    typeDefs: schema.typeDefs,
    resolvers: schema.resolvers,
  });

  await apolloServer.start();

  app.use(
  "/graphql",
  express.json(),
  expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        const user = getUserFromAuthHeader(req.headers.authorization);
        return { user };
      },
    })
  );

  await connectDB();

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`✅ MongoDB connected`);
    console.log(`✅ Server running: http://localhost:${PORT}/graphql`);
    console.log(`📷 Upload endpoint: http://localhost:${PORT}/upload`);
  });
}

start().catch((e) => {
  console.error("Fatal start error:", e);
  process.exit(1);
});
