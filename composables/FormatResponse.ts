class FormatResponse {
  public success(
    data: any,
    message: string = "Thành công",
    code: number = 200
  ) {
    return {
      success: true,
      data,
      message,
      code,
    };
  }

  public failure(error: any, message: string = "Thất bại", code: number = 500) {
    console.log("Error: ", error);
    return {
      success: false,
      error,
      message,
      code,
    };
  }

  public error(
    event: any,
    message: string = "Lỗi máy chủ!",
    code: number = 500
  ) {
    setResponseStatus(event, code);
    return {
      success: false,
      message,
      code,
    };
  }

  public paginate(
    structure: any,
    message: string = "Thành công",
    code: number = 200
  ) {
    return {
      success: true,
      ...structure,
      message,
      code,
    };
  }
}

export default new FormatResponse();
