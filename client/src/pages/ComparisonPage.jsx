import React from 'react';
import { motion } from 'framer-motion';
import './ComparisonPage.css';

const ComparisonPage = () => {
    return (
        <motion.div
            className="comparison-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="comp-header">
                <h1>5G vs 6G: The Evolutionary Leap</h1>
                <p>Explore the transition from the current 5G "Connected Industry" standard to the AI-Native, high-frequency 6G future.</p>
            </div>

            <div className="comp-grid">
                {/* 5G Section */}
                <section className="comp-section tech-5g">
                    <div className="section-badge">CURRENT GENERATION</div>
                    <h2>5G Wireless Network</h2>
                    <p className="tech-desc">
                        5G (5th Generation) is the current global wireless standard, designed to connect virtually everyone and everything together including machines, objects, and devices. It operates primarily in Sub-6 GHz and mmWave bands.
                    </p>

                    <div className="tech-details">
                        <h4>Current Functioning:</h4>
                        <ul>
                            <li><strong>eMBB:</strong> Enhanced Mobile Broadband for high-speed internet.</li>
                            <li><strong>URLLC:</strong> Ultra-Reliable Low-Latency Communications for mission-critical apps.</li>
                            <li><strong>mMTC:</strong> Massive Machine Type Communications for IoT at scale.</li>
                            <li><strong>Slicing:</strong> Logical network partitioning for different use cases.</li>
                        </ul>
                    </div>

                    <div className="pros-cons">
                        <div className="pc-box pros">
                            <h5>Advantages</h5>
                            <ul>
                                <li>Mature ecosystems and hardware.</li>
                                <li>Global wide-area coverage established.</li>
                                <li>High energy efficiency for mobile devices.</li>
                                <li>Lower infrastructure cost (reuse 4G sites).</li>
                            </ul>
                        </div>
                        <div className="pc-box cons">
                            <h5>Disadvantages</h5>
                            <ul>
                                <li>Spectrum congestion in Sub-6GHz.</li>
                                <li>Limited support for sub-THz applications.</li>
                                <li>Static AI/ML integration (not AI-native).</li>
                                <li>High mmWave path loss issues.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 6G Section */}
                <section className="comp-section tech-6g">
                    <div className="section-badge">NEXT GENERATION</div>
                    <h2>6G Intelligent Network</h2>
                    <p className="tech-desc">
                        6G (6th Generation) is the successor to 5G, targeting terabit-per-second speeds and microsecond latency. It is designed to be AI-Native from the physical layer up, enabling a seamless blend of the physical and digital worlds.
                    </p>

                    <div className="tech-details">
                        <h4>Planned Upgrades:</h4>
                        <ul>
                            <li><strong>Sub-THz Band:</strong> Utilizing 100GHz to 3THz for massive bandwidth.</li>
                            <li><strong>AI-Native Air Interface:</strong> Neural network-based waveform and beamforming.</li>
                            <li><strong>ISAC:</strong> Joint communication and sensing for environment mapping.</li>
                            <li><strong>Global 3D Coverage:</strong> Integration with Satellite (NTN) and HAPS.</li>
                        </ul>
                    </div>

                    <div className="pros-cons">
                        <div className="pc-box pros">
                            <h5>Advantages</h5>
                            <ul>
                                <li>10-100x higher throughput than 5G.</li>
                                <li>Hyper-connected Digitial Twins (Live Sync).</li>
                                <li>Sub-millisecond end-to-end latency.</li>
                                <li>Centimeter-level localization accuracy.</li>
                            </ul>
                        </div>
                        <div className="pc-box cons">
                            <h5>Disadvantages</h5>
                            <ul>
                                <li>Extremely high infrastructure cost.</li>
                                <li>Complex signal processing requirements.</li>
                                <li>High path loss in THz bands.</li>
                                <li>Security and Privacy risks with AI-Native RAN.</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>

            {/* Comparison Table */}
            <div className="comp-table-container">
                <h2>Key Metric Comparison</h2>
                <table className="comp-table">
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th>5G (Standard)</th>
                            <th>6G (Proposed)</th>
                            <th>Improvement</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Peak Data Rate</td>
                            <td>20 Gbps</td>
                            <td>1,000 Gbps (1 Tbps)</td>
                            <td>50x Increase</td>
                        </tr>
                        <tr>
                            <td>User Experience Rate</td>
                            <td>100 Mbps</td>
                            <td>1 Gbps</td>
                            <td>10x Increase</td>
                        </tr>
                        <tr>
                            <td>Air Interface Latency</td>
                            <td>1 ms</td>
                            <td>0.1 ms (100 µs)</td>
                            <td>90% Reduction</td>
                        </tr>
                        <tr>
                            <td>Connection Density</td>
                            <td>10^6 devices/km²</td>
                            <td>10^7 devices/km²</td>
                            <td>10x Density</td>
                        </tr>
                        <tr>
                            <td>AI Integration</td>
                            <td>Overlay (Management)</td>
                            <td>AI-Native (PHY/MAC)</td>
                            <td>Fundamental Shift</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default ComparisonPage;
