import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaClock,
} from "react-icons/fa";
import { Footer, Header } from "../../../components/HeaderFooter";
import { useState } from "react";
import imgeContact from "../../../assets/support.png";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire soumis:", formData);
    alert("Message envoyé avec succès!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Header />

      <div className="primary-bg py-5">
        <div className="container">
          <div className="row align-items-center">
            <img
              src={imgeContact}
              alt="Équipe de livraison"
              className=" object-fit-cover d-none d-md-block col-md-4 order-md-2 justify-content-center align-items-center rounded-4 bg-dark-subtle"
            />
            <div className="col-md-8 order-md-1 text-white py-4">
              <h1 className="display-5 fw-bold mb-3">Contactez Notre Équipe</h1>
              <p className="lead mb-4 text-white">
                Nous répondons sous 24 heures
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-4 p-md-5">
                <h2 className="mb-4">
                  <FaPaperPlane className="text-primary me-2" />
                  Envoyez un message
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">
                      Sujet
                    </label>
                    <select
                      className="form-select"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="support">Support technique</option>
                      <option value="partnership">Partenariat</option>
                      <option value="sales">Service commercial</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      rows="5"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary px-4 py-2">
                    Envoyer le message <FaPaperPlane className="ms-2" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-4 p-md-5">
                <h2 className="mb-4">
                  <FaMapMarkerAlt className="text-primary me-2" />
                  Nos coordonnées
                </h2>

                <div className="mb-4">
                  <h5 className="d-flex align-items-center mb-3">
                    <FaMapMarkerAlt className="text-secondary me-3" />
                    Adresse
                  </h5>
                  <p>
                    École Nationale de l'Intelligence Artificielle et du Digital
                    , Berkane Maroc
                    <br />
                  </p>
                </div>

                <div className="mb-4">
                  <h5 className="d-flex align-items-center mb-3">
                    <FaPhone className="text-secondary me-3" />
                    Téléphone
                  </h5>
                  <p>
                    <a
                      href="tel:+212600000000"
                      className="text-decoration-none"
                    >
                      +212 6 00 00 00 00
                    </a>
                    <br />
                    <small>(Service client 24/7)</small>
                  </p>
                </div>

                <div className="mb-4">
                  <h5 className="d-flex align-items-center mb-3">
                    <FaEnvelope className="text-secondary me-3" />
                    Email
                  </h5>
                  <p>
                    <a
                      href="mailto:contact@nexway.com"
                      className="text-decoration-none"
                    >
                      contact@nexway.com
                    </a>
                  </p>
                </div>

                <div className="mb-4">
                  <h5 className="d-flex align-items-center mb-3">
                    <FaClock className="text-secondary me-3" />
                    Horaires
                  </h5>
                  <p>
                    Lundi-Vendredi : 8h-19h
                    <br />
                    Samedi : 9h-13h
                  </p>
                </div>

                <div className="ratio ratio-16x9 mt-4 rounded overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3271.5537829700315!2d-2.3616555!3d34.9176459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd782343599b6c93%3A0x1fdffb7c2e7d7df7!2s%C3%89cole%20Nationale%20de%20L&#39;Intelligence%20Artificielle%20%26%20du%20Digital_Berkane!5e0!3m2!1sar!2sma!4v1748036605675!5m2!1sar!2sma"
                    allowFullScreen=""
                    loading="lazy"
                    title="Carte de localisation"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Questions fréquentes</h2>
          <div className="accordion" id="faqAccordion">
            <div className="accordion-item border-0 shadow-sm mb-3">
              <h3 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                >
                  Quels sont vos délais de réponse ?
                </button>
              </h3>
              <div
                id="collapseOne"
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  Notre équipe s'engage à répondre à toutes les demandes dans un
                  délai maximum de 24 heures ouvrées.
                </div>
              </div>
            </div>

            <div className="accordion-item border-0 shadow-sm mb-3">
              <h3 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                >
                  Acceptez-vous les demandes de partenariat ?
                </button>
              </h3>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  Oui, nous étudions toutes les propositions de partenariat.
                  Utilisez le sujet "Partenariat" dans le formulaire.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;
