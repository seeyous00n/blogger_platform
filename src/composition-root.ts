import { AuthController } from "./auth/auth.controller";
import { AuthRepository } from "./auth/auth.repository";
import { AuthService } from "./auth/auth.service";
import { UsersController } from "./users/users.controller";
import { UserRepository } from "./users/users.repository";
import { UserService } from "./users/user.service";
import { UsersQueryRepository } from "./users/usersQuery.repository";
import { CommentsController } from "./comments/comments.controller";
import { CommentRepository } from "./comments/comment.repository";
import { CommentService } from "./comments/comment.service";
import { CommentQueryRepository } from "./comments/commentQuery.repository";
import { BlogsRepository } from "./blogs/blogs.repository";
import { BlogService } from "./blogs/blog.service";
import { BlogsController } from "./blogs/blogs.controller";
import { BlogsQueryRepository } from "./blogs/blogsQuery.repository";
import { PostsController } from "./posts/posts.controller";
import { PostsRepository } from "./posts/posts.repository";
import { PostService } from "./posts/post.service";
import { PostsQueryRepository } from "./posts/postsQuery.repository";
import { TestingController } from "./testing/testing.controller";
import { SecurityController } from "./security/security.controller";
import { SecurityRepository } from "./security/security.repository";
import { SecurityService } from "./security/security.service";
import { NodemailerService } from "./common/adapters/nodemailer.service";
import { TokenService } from "./common/services/token.service";
import { SecurityQueryRepository } from "./security/securityQuery.repository";
import { RateLimitService } from "./common/services/rateLimit.service";
import { LikeRepository } from "./like/like.repository";
import { LikeService } from "./like/like.service";

const authRepository = new AuthRepository();
const securityRepository = new SecurityRepository();
const userRepository = new UserRepository();
export const blogsRepository = new BlogsRepository();
const postsRepository = new PostsRepository();
const commentRepository = new CommentRepository();
const likeRepository = new LikeRepository();

const nodemailerService = new NodemailerService();
export const tokenService = new TokenService();
export const rateLimitService = new RateLimitService();

const likeService = new LikeService(likeRepository);
const authService = new AuthService(authRepository, userRepository, nodemailerService, tokenService);
const securityService = new SecurityService(securityRepository, tokenService);
const userService = new UserService(userRepository);
const blogService = new BlogService(blogsRepository);
const postService = new PostService(postsRepository, blogsRepository);
const commentService = new CommentService(commentRepository, userRepository, postsRepository, likeRepository);

const securityQueryRepository = new SecurityQueryRepository(tokenService);
const usersQueryRepository = new UsersQueryRepository();
const blogsQueryRepository = new BlogsQueryRepository();
const postsQueryRepository = new PostsQueryRepository();
const commentQueryRepository = new CommentQueryRepository(likeService);

export const authController = new AuthController(authService, userService, usersQueryRepository, tokenService);
export const securityController = new SecurityController(securityService, securityQueryRepository);
export const usersController = new UsersController(userService, usersQueryRepository);
export const blogsController = new BlogsController(blogService, blogsQueryRepository, postService, postsQueryRepository);
export const postsController = new PostsController(postService, postsQueryRepository, commentService, commentQueryRepository);
export const commentsController = new CommentsController(commentService, commentQueryRepository);

export const testingController = new TestingController();
