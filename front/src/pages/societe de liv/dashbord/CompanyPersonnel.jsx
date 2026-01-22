import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

function CompanyPersonnel() {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterBlocked, setFilterBlocked] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentPersonnel, setCurrentPersonnel] = useState(null);

  useEffect(() => {
    fetchPersonnel();
  }, [filterBlocked]);

  const fetchPersonnel = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/company/personnel`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      let filteredData = response.data;
      if (filterBlocked !== "all") {
        const isBlocked = filterBlocked === "true";
        filteredData = filteredData.filter((p) => p.blocked === isBlocked);
      }
      setPersonnel(filteredData);
    } catch (err) {
      console.error("Error fetching personnel:", err);
      setError("Failed to load delivery personnel.");
    } finally {
      setLoading(false);
    }
  };

  const addFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      capacityKg: 0,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Prénom requis"),
      lastName: Yup.string().required("Nom requis"),
      email: Yup.string().email("Email invalide").required("Email requis"),
      phone: Yup.string().required("Téléphone requis"),
      password: Yup.string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .required("Mot de passe requis"),
      capacityKg: Yup.number()
        .min(0, "Capacité doit être positive")
        .required("Capacité requise"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setError("");
      try {
        const token = localStorage.getItem("jwtToken");
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/company/personnel`,
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setShowAddModal(false);
        resetForm();
        fetchPersonnel();
      } catch (err) {
        console.error("Error adding personnel:", err);
        setError(err.response?.data || "Failed to add personnel.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const updateFormik = useFormik({
    initialValues: {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      capacityKg: 0,
      blocked: false,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Prénom requis"),
      lastName: Yup.string().required("Nom requis"),
      email: Yup.string().email("Email invalide").required("Email requis"),
      phone: Yup.string().required("Téléphone requis"),
      capacityKg: Yup.number()
        .min(0, "Capacité doit être positive")
        .required("Capacité requise"),
      blocked: Yup.boolean().required("Statut de blocage requis"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      setError("");
      try {
        const token = localStorage.getItem("jwtToken");
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/company/personnel/${values.id}`,
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setShowUpdateModal(false);
        fetchPersonnel();
      } catch (err) {
        console.error("Error updating personnel:", err);
        setError(err.response?.data || "Failed to update personnel.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleShowUpdateModal = (personnelItem) => {
    setCurrentPersonnel(personnelItem);
    updateFormik.setValues({
      id: personnelItem.id,
      firstName: personnelItem.firstName,
      lastName: personnelItem.lastName,
      email: personnelItem.email,
      phone: personnelItem.phone,
      capacityKg: personnelItem.capacityKg,
      blocked: personnelItem.blocked,
    });
    setShowUpdateModal(true);
  };

  return (
    <div className="container-fluid">
      <h3 className="mb-4">🚚 Gestion des Livreurs</h3>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-primary"
          onClick={() => {
            addFormik.resetForm();
            setError("");
            setShowAddModal(true);
          }}
        >
          ➕ Ajouter un Livreur
        </button>

        <div className="w-25">
          <label htmlFor="filterBlocked" className="form-label fw-semibold mb-0">
            Filtrer par Statut:
          </label>
          <select
            id="filterBlocked"
            className="form-select"
            value={filterBlocked}
            onChange={(e) => setFilterBlocked(e.target.value)}
          >
            <option value="all">Tous</option>
            <option value="false">Actif</option>
            <option value="true">Bloqué</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : personnel.length === 0 ? (
        <div className="alert alert-info text-center">
          Aucun livreur trouvé.
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Capacité (kg)</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {personnel.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.firstName}</td>
                      <td>{p.lastName}</td>
                      <td>{p.email}</td>
                      <td>{p.phone}</td>
                      <td>{p.capacityKg} kg</td>
                      <td>
                        <span
                          className={`badge bg-${
                            p.blocked ? "danger" : "success"
                          }`}
                        >
                          {p.blocked ? "Bloqué" : "Actif"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => handleShowUpdateModal(p)}
                        >
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un nouveau Livreur</Modal.Title>
        </Modal.Header>
        <Form onSubmit={addFormik.handleSubmit}>
          <Modal.Body>
            {error && <div className="alert alert-danger">{error}</div>}
            {/* formulaire inchangé */}
          </Modal.Body>
        </Form>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier Livreur</Modal.Title>
        </Modal.Header>
        <Form onSubmit={updateFormik.handleSubmit}>
          <Modal.Body>
            {error && <div className="alert alert-danger">{error}</div>}
            {/* formulaire inchangé */}
          </Modal.Body>
        </Form>
      </Modal>
    </div>
  );
}

export default CompanyPersonnel;
