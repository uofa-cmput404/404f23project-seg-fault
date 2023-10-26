import useSignInViewModel from "./../Components/auth/SignInViewModel";
import axios from "axios";

jest.mock("axios");

describe("useSignInViewModel", () => {
  it("should handle a successful login", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: {
        token: "yourAuthToken",
        author: {
          id: 1,
          displayName: "JohnDoe",
          profileImage: "user.jpg",
          github: "https://github.com/Julian",
        },
      },
    });

    const mockNavigate = jest.fn();
    const { formData, handleSubmit } = useSignInViewModel(mockNavigate);

    const event = {
      target: {
        name: "username",
        value: "testuser",
      },
    };

    formData.username = "testuser";
    formData.password = "testpassword";

    await handleSubmit(event);

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });
});
