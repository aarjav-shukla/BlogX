import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';

//ts type declaration
type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

const app = new Hono<{
  Bindings: Bindings;
}>();

app.use('*', cors());

app.route("/api/v1/user",userRouter)
app.route("/api/v1/blog",blogRouter)

export default app
