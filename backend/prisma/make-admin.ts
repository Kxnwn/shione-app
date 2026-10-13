
import prisma from "../src/config/prisma.js";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim();

  if (!email) {
    throw new Error("ADMIN_EMAIL is not set in your environment.");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("No account found for ADMIN_EMAIL.");
  }

  if (user.role === "ADMIN") {
    console.log("This account is already an ADMIN:", {
      id: user.id,
      role: user.role,
    });
    return;
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
    select: {
      id: true,
      role: true,
    },
  });

  console.log("Admin account successfully promoted:", updatedUser);
}

main()
  .catch((error) => {
    console.error("Failed to promote admin account:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
