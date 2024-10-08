import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useUploadImageMutation } from "../api/imageSlice";

const UploadImagePage = () => {
  const [file, setFile] = useState(null);
  const [uploadImage, { isLoading, isSuccess, isError }] =
    useUploadImageMutation();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await uploadImage(formData).unwrap();
        console.log(response);
        alert("Imagen subida con éxito");
      } catch (err) {
        console.error("Error al subir la imagen:", err);
        alert("Error al subir la imagen. Revisa la consola para más detalles.");
      }
    }
  };
  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mt: 4 }}>
        Subir Imagen
      </Typography>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
        onSubmit={(e) => e.preventDefault()}
      >
        <TextField
          type="file"
          onChange={handleFileChange}
          inputProps={{ accept: "image/*" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Subir Imagen"}
        </Button>
        {isSuccess && (
          <Typography color="green">Imagen subida con éxito.</Typography>
        )}
        {isError && (
          <Typography color="red">Error al subir la imagen.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default UploadImagePage;
