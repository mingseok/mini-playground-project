<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>회원가입</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    div {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      background-color: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
    }

    h2 {
      text-align: center;
      color: #007bff;
    }

    form {
      margin-top: 20px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    input {
      width: 100%;
      padding: 8px;
      margin-bottom: 15px;
      box-sizing: border-box;
    }

    button {
      background-color: #007bff;
      color: #fff;
      padding: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>

<div>
  <h2>회원가입</h2>
  <form action="/api/register" method="post">
    <label for="name">이름:</label>
    <input type="text" id="name" name="name" required><br>

    <label for="password">비밀번호:</label>
    <input type="password" id="password" name="password" required><br>

    <label for="email">이메일:</label>
    <input type="email" id="email" name="email" required><br>

    <label for="nickname">닉네임:</label>
    <input type="text" id="nickname" name="nickname" required><br>

    <button type="submit">가입하기</button>
  </form>
</div>

</body>
</html>
