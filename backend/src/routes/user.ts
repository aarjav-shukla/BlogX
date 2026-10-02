import { Hono } from "hono";
import { PrismaClient } from "../../generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signinInput, signupInput} from "@aarjav-shukla/medium-common";

type Bindings = {
DATABASE_URL: string;
JWT_SECRET: string;
};

export const userRouter = new Hono<{
Bindings: Bindings;
}>();

userRouter.post("/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if (!success) {
      return c.json(
        {
          message: "inputs not valid. Please ensure email is valid and password has at least 6 characters.",
        },
        411
      );
    }
    const prisma = new PrismaClient({
      accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      // If password matches, automatically log them in
      if (existingUser.password === body.password) {
        const token = await sign({ id: existingUser.id }, c.env.JWT_SECRET);
        return c.json({
          jwt: token,
          message: "Account already exists. Signed in successfully!",
        });
      }
      return c.json(
        {
          message: "User with this email already exists. Please sign in with your password.",
        },
        400
      );
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.username || body.name || null,
      },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      jwt: token,
      message: "User account created successfully!",
    });
  } catch (error: any) {
    console.error("Signup error:", error);

    return c.json(
      {
        message: error?.message || "Signup failed on backend server",
      },
      500
    );
  }
});

userRouter.post("/signin", async (c) => {
  try {
    const prisma = new PrismaClient({
      accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success) {
      return c.json(
        {
          message: "inputs not valid. Please check email and password.",
        },
        411
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      return c.json(
        {
          error: "user not found",
          message: "No user found with this email address. Please sign up.",
        },
        403
      );
    }
    if (user.password !== body.password) {
      return c.json(
        {
          message: "Invalid password. Please check your credentials.",
        },
        401
      );
    }
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
      jwt: token,
      message: "User successfully signed in!",
    });
  } catch (error: any) {
    console.error("Signin error:", error);
    return c.json(
      {
        message: error?.message || "Signin failed on backend server",
      },
      500
    );
  }
});