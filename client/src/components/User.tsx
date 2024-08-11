import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CircularProgress,
  Box,
  TextField,
  Link,
  Modal,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import qrcode from 'qrcode';
import { API, getLogin, deleteCookie, logout } from '../util';

const User: React.FC = () => {
  const { login: loginParam } = useParams<{ login: string }>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!getLogin());
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [showPicture, setShowPicture] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State to manage dialog
  const [newPicture, setNewPicture] = useState<File | null>(null); // State for new profile picture
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (loginParam) {
      fetchUserData();
    }
  }, [isLoggedIn, loginParam, navigate]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API}/user/${loginParam}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setUserData(data);
      setTwoFAEnabled(data.isTwoFAEnabled);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter' && newUsername) {
      try {
        const response = await fetch(`${API}/user/${userData.login}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ displayName: newUsername }),
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to update username');

        const updatedUser = await response.json();
        setUserData(updatedUser); // Update local state with the response from the server
        setEditingUsername(false);
      } catch (error) {
        setError('Failed to update username');
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${API}/user/${userData.login}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete account');

      setIsLoggedIn(false);
      setUserData(null);
      logout();
      deleteCookie('accessToken');

      location.pathname = '/';
    } catch (error) {
      setError('Failed to delete account');
    }
  };

  const handleImageChange = async () => {
    if (!newPicture) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      try {
        const response = await fetch(`${API}/user/${userData.login}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ picture: base64Image }),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to update image');
        }

        const updatedUser = await response.json();
        setUserData(updatedUser); // Update local state with the response from the server
      } catch (error) {
        setError('Failed to update image');
      }
    };
    reader.readAsDataURL(newPicture);
  };

  const handleTwoFAToggle = async () => {
    setTwoFAEnabled(!twoFAEnabled);
    if (!twoFAEnabled) {
      enableTwoFAForUser();
    } else {
      disableTwoFAForUser();
    }
  };

  const enableTwoFAForUser = async () => {
    try {
      const response = await fetch(`${API}/user/${userData.login}/2fa/enable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to enable 2FA');

      const data = await response.json();
      const qrCodeUrl = await qrcode.toDataURL(data.otpauthUrl);
      setQrCode(qrCodeUrl);
      setTwoFAEnabled(true);
    } catch (error) {
      setError('Failed to enable 2FA');
    }
  };

  const disableTwoFAForUser = async () => {
    try {
      const response = await fetch(
        `${API}/user/${userData.login}/2fa/disable`,
        {
          method: 'POST', // Using POST as per the backend method
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );

      if (!response.ok) throw new Error('Failed to disable 2FA');

      setQrCode(null);
      setTwoFAEnabled(false);
    } catch (error) {
      setError('Failed to disable 2FA');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!userData) return null;

  return (
    <Box
      sx={{
        padding: '2rem',
        marginTop: '2rem',
        marginLeft: '2rem',
        fontFamily: 'Fira Code, monospace',
        color: '#00ff00',
      }}
    >
      <Box sx={{ marginBottom: '1rem' }}>
        <span>'username'</span>
        {editingUsername ? (
          <TextField
            variant="outlined"
            size="small"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            onKeyDown={handleUsernameChange}
            sx={{
              marginLeft: '1rem',
              backgroundColor: '#1e1e1e',
              color: '#00ff00',
            }}
            inputProps={{
              style: { color: '#00ff00', fontFamily: 'Fira Code, monospace' },
            }}
            autoFocus
          />
        ) : (
          <Link
            component="button"
            onClick={() => setEditingUsername(true)}
            sx={{ marginLeft: '1rem', color: '#00ff00' }}
          >
            {userData.displayName}
          </Link>
        )}
      </Box>

      <Box sx={{ marginBottom: '1rem' }}>
        <span>'intra_login'</span> {userData.login}
      </Box>

      <Box sx={{ marginBottom: '1rem' }}>
        <span>'profile picture'</span>
        <Link
          component="button"
          onClick={() => setShowPicture(true)}
          sx={{ marginLeft: '1rem', color: '#00ff00' }}
        >
          View Picture
        </Link>
        {getLogin() === userData.login && (
          <Box sx={{ marginTop: '1rem' }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewPicture(e.target.files ? e.target.files[0] : null)
              }
              style={{ marginTop: '1rem' }}
            />
            <Button
              onClick={handleImageChange}
              disabled={!newPicture}
              sx={{
                marginTop: '1rem',
                color: '#00ff00',
                borderColor: '#00ff00',
              }}
              variant="outlined"
            >
              Update Picture
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ marginBottom: '1rem' }}>
        <span>'enable 2fa'</span>
        <Link
          component="button"
          onClick={handleTwoFAToggle}
          sx={{ marginLeft: '1rem', color: '#00ff00' }}
        >
          {twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </Link>
        {twoFAEnabled && qrCode && (
          <div style={{ marginTop: '1rem' }}>
            <Typography variant="h6">
              Scan this QR code with your authenticator app:
            </Typography>
            <img
              src={qrCode}
              alt="2FA QR Code"
              style={{ width: '200px', height: '200px' }}
            />
          </div>
        )}
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="secondary"
            sx={{ backgroundColor: '#ff0000', color: '#fff' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default User;
