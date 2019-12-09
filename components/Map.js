import styled from "styled-components";

const Map = ({ className }) => (
  <iframe
    className={className}
    frameborder="0"
    src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJDT2mdOPlpEARcj_KobIlCnU&key=AIzaSyAPM1cc0bHAfhVVDlVtBuPMwAcS7-fBdWc"
    allowfullscreen
  />
);

const StyledMap = styled(Map)`
  width: 800px;
  height: 600px;
`;

export default StyledMap;