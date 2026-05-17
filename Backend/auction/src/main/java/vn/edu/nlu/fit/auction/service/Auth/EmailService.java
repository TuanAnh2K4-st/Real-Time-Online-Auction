package vn.edu.nlu.fit.auction.service.Auth;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    /**
     * Gửi email chứa mã OTP đến địa chỉ email của người dùng.
     * @param toEmail  Email người nhận
     * @param otpCode  Mã OTP 6 chữ số
     */
    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("🔐 Mã xác thực OTP – BidMaster");
            helper.setText(buildHtmlContent(otpCode), true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Không thể gửi email OTP: " + e.getMessage());
        }
    }

    // Nội dung HTML email OTP
    private String buildHtmlContent(String otpCode) {
        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </head>
            <body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 0;">
                <tr><td align="center">
                  <table width="480" cellpadding="0" cellspacing="0"
                         style="background:#1e293b;border-radius:20px;overflow:hidden;
                                border:1px solid rgba(255,255,255,0.08);">
                    <!-- Header -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#1d4ed8,#312e81);
                                 padding:32px;text-align:center;">
                        <p style="color:#bfdbfe;font-size:13px;margin:0 0 8px;
                                  letter-spacing:4px;text-transform:uppercase;font-weight:600;">
                          BidMaster
                        </p>
                        <h1 style="color:#fff;font-size:26px;margin:0;font-weight:800;">
                          Xác nhận tài khoản
                        </h1>
                      </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                      <td style="padding:36px 40px;">
                        <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 24px;">
                          Cảm ơn bạn đã đăng ký tài khoản BidMaster. Vui lòng sử dụng mã OTP
                          bên dưới để hoàn tất quá trình đăng ký:
                        </p>
                        <!-- OTP Box -->
                        <div style="background:#0f172a;border-radius:16px;padding:28px;
                                    text-align:center;border:1px solid rgba(59,130,246,0.3);
                                    margin-bottom:24px;">
                          <p style="color:#64748b;font-size:11px;letter-spacing:3px;
                                    text-transform:uppercase;margin:0 0 16px;font-weight:600;">
                            Mã xác thực OTP
                          </p>
                          <p style="font-size:48px;font-weight:900;letter-spacing:16px;
                                    color:#60a5fa;margin:0;font-family:monospace;">
                            %s
                          </p>
                        </div>
                        <div style="background:rgba(245,158,11,0.1);border-radius:12px;
                                    padding:16px 20px;border:1px solid rgba(245,158,11,0.2);">
                          <p style="color:#fbbf24;font-size:13px;margin:0;font-weight:600;">
                            ⏱ Mã OTP có hiệu lực trong <strong>3 phút</strong>.
                            Không chia sẻ mã này với bất kỳ ai.
                          </p>
                        </div>
                        <p style="color:#475569;font-size:13px;margin:24px 0 0;line-height:1.6;">
                          Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
                          Tài khoản sẽ không được tạo.
                        </p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);
                                 text-align:center;">
                        <p style="color:#334155;font-size:12px;margin:0;">
                          © 2026 BidMaster. Nền tảng đấu giá trực tuyến.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(otpCode);
    }
}
