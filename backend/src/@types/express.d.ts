declare namespace Express {
  interface Request {
    user: {
      _id: string;
      fullname: string;
      studentId: string | number | undefined;
      email: string;
      avatar: string;
    };
  }
}
