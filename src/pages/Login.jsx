import LogIn from "../assets/Designer.png"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Input from '@mui/material/Input';


const Login = () => {
  return (
    <>
      <Container fluid style={{padding : 0}}>
        <div className="common_bg">
          <Row>
            <Col>
              <div className="login_bg">
                <Row>
                  <Col xs={7} >
                    <div className="login_img"><img src={LogIn} alt="" /></div>
                  </Col>
                  <Col>
                    <div className="login_form">
                        <div className="login_title">
                            <span>Log</span><span>in</span>
                        </div>
                        <div><Input/></div>
                         <div><Input/></div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  )
}

export default Login
