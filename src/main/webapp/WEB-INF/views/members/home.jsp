<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Home</title>
</head>
<body>

<h2>Home 화면</h2>

<!-- pw.jsp로 이동하는 버튼 -->
<form action="/pwPage">
    <button type="submit">비밀번호 찾기 이동</button>
</form>

<!-- 회원가입 페이지로 이동하는 버튼 -->
<form action="/api/join">
    <button type="submit">회원가입 페이지로 이동</button>
</form>

<!-- 다른 페이지로 이동할 수 있는 버튼 추가 -->
<!-- 예시: pw.jsp 대신 실제로 이동하고자 하는 JSP 페이지로 수정 -->
<form action="other.jsp">
    <button type="submit">다른 페이지로 이동</button>
</form>



<p>로그인을 해주세요 :)</p>

<form action="/login" method="post">
    <div>
        <label for="userId">아이디: </label>
        <input id="userId" name="name" type="text" required>
    </div>
    <div>
        <label for="password">패스워드: </label>
        <input id="password" name="password" type="password" required>
    </div>
    <input type="submit" value="로그인하기">
</form>


<p>${loginMessage}</p>


</body>
</html>
