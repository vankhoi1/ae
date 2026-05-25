package com.movieticket.service.impl;

import com.movieticket.entity.Booking;
import com.movieticket.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Override
    public void sendBookingConfirmation(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(booking.getUser().getEmail());
            helper.setSubject("Booking Confirmation - MovieTicket");

            String content = buildEmailContent(booking);
            helper.setText(content, true);

            mailSender.send(message);
            log.info("Confirmation email sent to {}", booking.getUser().getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send email", e);
        }
    }

    private String buildEmailContent(Booking booking) {
        return "<h1>Booking Confirmed!</h1>" +
                "<p>Movie: " + booking.getShowtime().getMovie().getTitle() + "</p>" +
                "<p>Date: " + booking.getShowtime().getStartTime() + "</p>" +
                "<p>Room: " + booking.getShowtime().getRoom().getName() + "</p>" +
                "<p>Total: $" + booking.getTotalPrice() + "</p>" +
                "<p>Thank you for your booking!</p>";
    }
}
