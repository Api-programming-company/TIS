import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useCreateCompanyMutation } from "../api/companyApi";

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

const RegistroGE = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const [createCompany, { data, error, isSuccess, isError, isLoading }] =
    useCreateCompanyMutation();

  useEffect(() => {
    if (isSuccess) {
      setSnackbarMessage("Formulario enviado con éxito");
      setSnackbarOpen(true);
      navigate("/");
    }
    if (isError) {
      setSnackbarMessage("Error al enviar el formulario");
      setSnackbarOpen(true);
      console.log(error);

      // Manejo de errores de validación
      if (error?.status === 422 && error.data?.errors) {
        const serverErrors = error.data.errors;
        const newErrors = {};

        // Mapear los errores del servidor a los errores de estado
        for (const [key, messages] of Object.entries(serverErrors)) {
          const customMessages = {
            long_name: "El nombre largo ya está en uso.",
            short_name: "El nombre corto ya está en uso.",
            email: "El correo electrónico ya está en uso.",
            address: "La dirección ya está en uso.",
            phone: "El teléfono ya está en uso.",
            members: "Los miembros no son válidos.",
          };
          newErrors[key] = customMessages[key] || messages[0];
        }
        setErrors(newErrors);
        console.log("nuevos errores");
        console.log(newErrors);
      }
    }
  }, [isSuccess, isError, navigate, error]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpia el error del campo al cambiar el valor
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { long_name, short_name, email, address, phone } = formData;
    let hasError = false;
    const newErrors = {};

    const validations = {
      long_name: {
        condition: !long_name || long_name.length > 32,
        message: !long_name
          ? "El nombre largo es obligatorio."
          : "El nombre largo no debe exceder 32 caracteres.",
      },
      short_name: {
        condition: !short_name || short_name.length > 10,
        message: !short_name
          ? "El nombre corto es obligatorio."
          : "El nombre corto no debe exceder 10 caracteres.",
      },
      email: {
        condition: !email || !validateEmail(email),
        message: !email
          ? "El correo electrónico es obligatorio."
          : "Ingrese un correo electrónico válido.",
      },
      address: {
        condition: !address,
        message: "La dirección es obligatoria.",
      },
      phone: {
        condition: !phone || !/^\d+$/.test(phone) || phone.length < 8,
        message: !phone
          ? "El teléfono es obligatorio."
          : "El teléfono debe contener solo dígitos y tener al menos 8 caracteres.",
      },
    };

    console.log(formData);

    for (const [field, { condition, message }] of Object.entries(validations)) {
      if (condition) {
        newErrors[field] = message;
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const dataToSend = {
      long_name,
      short_name,
      email,
      address,
      phone,
    };

    console.log("Enviando datos:", dataToSend);
    createCompany(dataToSend);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ mt: 5, mb: 10, maxWidth: 600, mx: "auto" }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ textAlign: "center", mb: 3 }}
      >
        Registrar Grupo Empresa
      </Typography>

      <form onSubmit={handleSubmit}>
        {[
          { label: "Nombre largo*", value: "long_name" },
          { label: "Nombre corto*", value: "short_name" },
          { label: "Correo electrónico*", value: "email" },
          { label: "Dirección*", value: "address" },
          { label: "Teléfono*", value: "phone" },
        ].map(({ label, value }) => (
          <Box sx={{ mb: 2 }} key={value}>
            <TextField
              label={label}
              variant="outlined"
              fullWidth
              name={value}
              value={formData[value] || ""}
              onChange={handleInputChange}
              helperText={errors[value]}
              error={!!errors[value]}
            />
          </Box>
        ))}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ display: "block", mx: "auto", mt: 3, px: 12, py: 1 }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "REGISTRAR"
          )}
        </Button>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default RegistroGE;
