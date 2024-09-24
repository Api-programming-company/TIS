import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  List,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Deliverable from "./Deliverable";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const Milestone = ({ milestone, isEditing, onChange }) => {
  const [openDeliverables, setOpenDeliverables] = useState(false);
  const [startDate, setStartDate] = useState(new Date(milestone.start_date));
  const [endDate, setEndDate] = useState(new Date(milestone.end_date));
  const [name, setName] = useState(milestone.name);
  const [billingPercentage, setBillingPercentage] = useState(
    milestone.billing_percentage
  );

  const handleToggle = () => {
    setOpenDeliverables((prev) => !prev);
  };

  const handleDeliverableChange = (updatedDeliverable) => {
    const updatedDeliverables = milestone.deliverables.map((deliverable) =>
      deliverable.id === updatedDeliverable.id
        ? updatedDeliverable
        : deliverable
    );

    onChange({ ...milestone, deliverables: updatedDeliverables });
  };

  const handleNameChange = (newName) => {
    setName(newName);
    onChange({ ...milestone, name: newName });
  };

  const handleStartDateChange = (newStartDate) => {
    setStartDate(newStartDate);
    onChange({ ...milestone, start_date: newStartDate });
  };

  const handleEndDateChange = (newEndDate) => {
    setEndDate(newEndDate);
    onChange({ ...milestone, end_date: newEndDate });
  };

  const handleBillingPercentageChange = (newBillingPercentage) => {
    setBillingPercentage(newBillingPercentage);
    onChange({ ...milestone, billing_percentage: newBillingPercentage });
  };

  const handleAddDeliverable = () => {
    const newDeliverable = {
      name: "Nuevo Entregable",
      responsible: "",
      objective: "",
    };

    const updatedDeliverables = [...milestone.deliverables, newDeliverable];
    onChange({ ...milestone, deliverables: updatedDeliverables });
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <ListItem button onClick={handleToggle}>
        <ListItemText
          primary={
            isEditing ? (
              <TextField
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                fullWidth
              />
            ) : (
              name
            )
          }
        />
        <IconButton>
          {openDeliverables ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </ListItem>
      <Collapse in={openDeliverables} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ListItem>
              <DatePicker
                label="Fecha de inicio"
                value={startDate}
                onChange={handleStartDateChange}
                renderInput={(params) => <TextField {...params} />}
                sx={{ mr: 2 }}
              />
              <DatePicker
                label="Fecha de fin"
                value={endDate}
                onChange={handleEndDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </ListItem>
            <ListItem>
              {isEditing ? (
                <TextField
                  label="Porcentaje de facturación"
                  value={billingPercentage}
                  onChange={(e) =>
                    handleBillingPercentageChange(e.target.value)
                  }
                  type="number"
                  fullWidth
                />
              ) : (
                <ListItemText primary={`% Facturación: ${billingPercentage}`} />
              )}
            </ListItem>
            <ListItem
              sx={{ display: "flex", justifyContent: "center", width: "100%" }}
            >
              {isEditing && (
                <Button
                  onClick={handleAddDeliverable}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    mb: 1,
                  }}
                >
                  Agregar Entregable
                </Button>
              )}
            </ListItem>
            <ListItem>
              <List>
                {milestone.deliverables.length > 0 ? (
                  milestone.deliverables.map((deliverable) => (
                    <Deliverable
                      key={deliverable.id}
                      deliverable={deliverable}
                      isEditing={isEditing}
                      onChange={handleDeliverableChange}
                    />
                  ))
                ) : (
                  <ListItemText primary="No hay entregables asignados." />
                )}
              </List>
            </ListItem>
          </LocalizationProvider>
        </List>
      </Collapse>
    </div>
  );
};

export default Milestone;
