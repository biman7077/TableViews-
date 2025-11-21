"use client";
import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

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
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    }
    fetchUsers();
  }, []);


  useEffect(() => {
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
  }, [search, city, users]);

  const cities = Array.from(new Set(users.map((user) => user.address.city)));

  return (
    <div style={{ padding: 20 }}>
      <h2>User Table</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 8,
            width: 250,
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 5,
            border: "1px solid #ccc",
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

      <DataTable
        columns={columns}
        data={filteredUsers}
        pagination
        highlightOnHover
        pointerOnHover
        paginationPerPage={5}
      />
    </div>
  );
}
