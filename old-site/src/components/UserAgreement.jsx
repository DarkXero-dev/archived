import UserAgreementContent from "../content/UserAgreementContent.md";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { marked } from "marked";

const Disclaimer = () => {
  const [content, setContent] = useState("");
  useEffect(() => {
    fetch(UserAgreementContent)
      .then((response) => response.text())
      .then((content) => {
        setContent(content);
      });
  }, []);

  return (
    <>
    <br />
    <ImgContainer>
        <center><img src="https://i.imgur.com/m3CMdCP.png" alt="XeroLinux" /></center>
      </ImgContainer>
      <div dangerouslySetInnerHTML={{ __html: marked.parse(content)}}></div>
      </>
  );
};

const ImgContainer = styled.div`
  width: 65%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-block-start: -1rem;
  margin-block-end: 1rem;
`;

export default Disclaimer;
