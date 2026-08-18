import React from 'react';
import { GroundedDoc, VideoReference, SMEContact } from '@/lib/store/useChatStore';
import './CitationBadge.css';

interface CitationBadgeProps {
  docs?: GroundedDoc[];
  video?: VideoReference;
  sme?: SMEContact;
}

export const CitationBadge: React.FC<CitationBadgeProps> = ({ docs, video, sme }) => {
  return (
    <div className="citations-group">
      {docs && docs.length > 0 && (
        <div>
          <div className="citation-header">OFFICIAL TEMPLATES & SOURCES</div>
          <div className="docs-grid">
            {docs.map((doc, index) => (
              <div key={index} className="citation-card">
                <div className={`doc-icon ${doc.type}`}>
                  {doc.type === 'doc' ? '📄' : '📊'}
                </div>
                <div>
                  <div className="card-title">{doc.title}</div>
                  <div className="card-subtitle">{doc.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {video && (
        <div>
          <div className="citation-header">TRAINING CLIP REFERENCE</div>
          <div className="video-card">
            <div className="video-left">
              <div className="play-icon-box">▶</div>
              <div>
                <div className="card-title">{video.title}</div>
                <div className="card-subtitle">Timestamp: {video.timestamp}</div>
              </div>
            </div>
            <button className="play-clip-btn">Play Clip</button>
          </div>
        </div>
      )}

      {sme && (
        <div>
          <div className="citation-header">APPROVAL SME (HUMAN CONTACT)</div>
          <div className="sme-card">
            <div className="sme-left">
              <div className="sme-avatar">{sme.initials}</div>
              <div>
                <div className="card-title">{sme.name}</div>
                <div className="card-subtitle">{sme.role}</div>
              </div>
            </div>
            <button className="contact-sme-btn">Contact</button>
          </div>
        </div>
      )}
    </div>
  );
};