import { Stack, Text } from "@chakra-ui/react"
import H2 from "components/headings/h2";
import * as React from "react";

import { PageElementJoinNewsletter } from "../../../../../shared/contract";

interface IProps {
    element: PageElementJoinNewsletter;
}

const PageElementJoinNewsletter: React.FC<IProps> = ({ element }) => {

    return (
        <Stack border="1px solid black">
            <div id="mc_embed_shell">
                <div id="mc_embed_signup">
                    <form
                        action="https://booketlistagency.us9.list-manage.com/subscribe/post?u=8c02d00d8abf75b34b6f715db&amp;id=7cfa8d5bcd&amp;f_id=004fe8e3f0"
                        method="post"
                        id="mc-embedded-subscribe-form"
                        name="mc-embedded-subscribe-form"
                        className="validate"
                    >
                        <div id="mc_embed_signup_scroll">
                            {element.title && (
                                <H2>{element.title}</H2>
                            )}
                            {element.caption && (
                                <Text paddingBottom={4}>{element.caption}</Text>
                            )}
                            <div className="mc-field-group">
                                <label htmlFor="mce-EMAIL">Email Address <span className="asterisk">*</span></label>
                                <input type="email" name="EMAIL" className="required email" id="mce-EMAIL" required />
                            </div>
                            <div id="mce-responses" className="clear">
                                <div className="response" id="mce-error-response" style={{ display: "none" }}></div>
                                <div className="response" id="mce-success-response" style={{ display: "none" }}></div>
                            </div>
                            <div style={{ position: "absolute", left: "-5000px" }}>
                                <input type="text" name="b_8c02d00d8abf75b34b6f715db_7cfa8d5bcd" tabIndex={-1} value="" />
                            </div>
                            <div className="clear">
                                <input type="submit" name="subscribe" id="mc-embedded-subscribe" className="button" value="Subscribe" />
                            </div>
                        </div>
                    </form>
                </div>
                {/* <script type="text/javascript" src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"></script><script type="text/javascript">(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[13]='MMERGE13';ftypes[13]='text';fnames[23]='MMERGE23';ftypes[23]='text';fnames[22]='MMERGE22';ftypes[22]='text';fnames[21]='MMERGE21';ftypes[21]='text';fnames[20]='MMERGE20';ftypes[20]='text';fnames[19]='MMERGE19';ftypes[19]='text';fnames[18]='MMERGE18';ftypes[18]='text';fnames[17]='MMERGE17';ftypes[17]='url';fnames[16]='MMERGE16';ftypes[16]='text';fnames[15]='MMERGE15';ftypes[15]='text';fnames[14]='MMERGE14';ftypes[14]='text';fnames[12]='MMERGE12';ftypes[12]='text';fnames[1]='FNAME';ftypes[1]='text';fnames[11]='MMERGE11';ftypes[11]='text';fnames[10]='MMERGE10';ftypes[10]='text';fnames[9]='MMERGE9';ftypes[9]='text';fnames[8]='MMERGE8';ftypes[8]='text';fnames[7]='MMERGE7';ftypes[7]='text';fnames[6]='MMERGE6';ftypes[6]='text';fnames[5]='BIRTHDAY';ftypes[5]='birthday';fnames[4]='PHONE';ftypes[4]='phone';fnames[3]='ADDRESS';ftypes[3]='address';fnames[2]='LNAME';ftypes[2]='text';}(jQuery));var $mcj = jQuery.noConflict(true);</script> */}
            </div>
        </Stack>
    );
}

export default PageElementJoinNewsletter;