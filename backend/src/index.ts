import { Hono } from 'hono'
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
// app.get('/', (c) => {
//   return c.text('Hello Hono!')
// })
app.route("/api/v1/user",userRouter)
app.route("/api/v1/blog",blogRouter)



export default app
