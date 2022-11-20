import React from 'react'
import { Col, Row } from 'react-bootstrap'

const FooterComponent: React.FC = () => {
    return (
        <footer id="contact-us">
            <Row>
                <Col lg={12}>
                    <div className="sub-footer">
                        <p>
                            Copyright &copy; 2020 Lava Landing Page | Designed
                            by{' '}
                            <a rel="nofollow" href="https://templatemo.com">
                                TemplateMo
                            </a>
                        </p>
                    </div>
                </Col>
            </Row>
        </footer>
    )
}

export default FooterComponent
