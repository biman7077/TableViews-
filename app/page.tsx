"use client";
import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

interface User {
  id: number;
  name: string;
  email: string;
  address: {
    city: string;
  };
}

export default function UserDataTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const columns: TableColumn<User>[] = [
    {
      name: "Name",
      selector: (row: User) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: User) => row.email,
    },
    {
      name: "City",
      selector: (row: User) => row.address.city,
    },
  ];

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      let result = users;

      if (search) {
        result = result.filter((user) =>
          user.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (city) {
        result = result.filter((user) => user.address.city === city);
      }

      setFilteredUsers(result);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, city, users]);

  const cities = Array.from(new Set(users.map((user) => user.address.city)));

  const handleRowClick = (row: User) => {
    setSelectedUser(row);
    setOpenModal(true);
    toast.success(`Selected: ${row.name}`);
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <ToastContainer />
      <h2
        style={{
          fontSize: 28,
          marginBottom: 20,
          textAlign: "center",
          background: "linear-gradient(90deg,#007bff,#6610f2)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        User Table
      </h2>

      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          marginBottom: 20,
          border: "1px solid #d0e8ff",
        }}
      >
        <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
          <input
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: 12,
              width: 250,
              borderRadius: 6,
              border: "1px solid #4da3ff",
              outline: "none",
            }}
          />

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 6,
              border: "1px solid #4da3ff",
              outline: "none",
              width: 200,
            }}
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: 20, fontSize: 18 }}>⏳ Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={filteredUsers}
            pagination
            highlightOnHover
            pointerOnHover
            paginationPerPage={10}
            onRowClicked={handleRowClick}
            customStyles={{
              table: { style: { border: "1px solid #b6d9ff" } },
              headCells: {
                style: {
                  background: "#e6f2ff",
                  fontWeight: "bold",
                  fontSize: 15,
                  borderBottom: "2px solid #b6d9ff",
                },
              },
              rows: {
                style: {
                  cursor: "pointer",
                  borderBottom: "1px solid #e8f3ff",
                },
              },
            }}
          />
        )}
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div style={{ fontSize: 16, lineHeight: 1.6 }}>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>City:</strong> {selectedUser.address.city}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
