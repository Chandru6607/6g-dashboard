import React from 'react';
import { motion } from 'framer-motion';
import './DocsPage.css'; // Reusing common styles

const SupportPage = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Support request submitted! We will get back to you soon.');
    };

    return (
        <motion.div
            className="support-page"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="support-header">
                <h1>Support Center</h1>
                <p>Need help? Our team is here to assist you with any questions or technical issues.</p>
            </div>

            <div className="support-content">
                <div className="support-grid">
                    <section className="support-section">
                        <h2>❓ FAQs</h2>
                        <div className="api-card">
                            <h3>How do I reset my connection?</h3>
                            <p>Go to Configuration {" > "} Network and click "Reconnect All".</p>
                        </div>
                        <div className="api-card">
                            <h3>Where can I find my agent logs?</h3>
                            <p>Logs are available in the Monitoring tab under "System Logs".</p>
                        </div>
                    </section>

                    <section className="support-section">
                        <h2>📩 Contact Us</h2>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" placeholder="Your Name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" placeholder="Email Address" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" rows="5" placeholder="How can we help?" required></textarea>
                            </div>
                            <button type="submit" className="submit-btn">Send Message</button>
                        </form>
                    </section>
                </div>

                <section className="support-section" style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <h2>🌐 Community & Social</h2>
                    <p>Join our developer community on Slack and GitHub for the latest updates.</p>
                </section>
            </div>
        </motion.div>
    );
};

export default SupportPage;
