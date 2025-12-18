import { useEffect, useState } from "react";
import styles from "./Users.module.css";
import { getUsers } from "../../../services/users.services";

interface User {
  id: string;
  email: string;       
  role: string;       
  createdAt: string;
}
export const Users = () => {
  // useState para almacenar usuarios
  const [users, setUsers] = useState<User[]>([]);
 
  useEffect(() => {
     async function obtenerUsers() {
    const response = await getUsers();
    setUsers(response);
  }
    obtenerUsers();
  }, []);


  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Usuarios</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Rol</th>
              <th>Alta</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>
                  <span
                    className={
                      user.role === "admin" ? styles.roleAdmin : styles.roleUser
                    }
                  >
                    {user.role}
                  </span>
                </td>
                <td>{user.createdAt}</td>
                <td className={styles.actionsCell}>
                  <button className={styles.actionBtn}>Editar</button>
                  <button className={styles.actionBtnDanger}>Bloquear</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
