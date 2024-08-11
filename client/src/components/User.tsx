import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  Switch,
  FormControlLabel,
  Box,
} from '@mui/material';
import qrcode from 'qrcode';
import { API, getLogin } from '../util';

// Authentication and User Context Setup
const AuthContext = createContext<any>(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!getLogin());
  const [user, setUser] = useState<any>(null);

  const login = () => {
    // Logic for logging in (e.g., API call)
    setIsLoggedIn(true);
    // Update user data
    setUser({ login: 'userLogin', displayName: 'User Display Name' });
  };

  const logout = () => {
    // Logic for logging out (e.g., API call)
    setIsLoggedIn(false);
    setUser(null);
  };

  const updateUserImage = async (login: string, base64Image: string) => {
    // Logic for updating user image (e.g., API call)
    return { ...user, picture: base64Image }; // Mock response
  };

  const updateUser = async (login: string, data: { displayName: string }) => {
    // Logic for updating user display name (e.g., API call)
    return { ...user, displayName: data.displayName }; // Mock response
  };

  const enableTwoFA = async (login: string) => {
    // Logic for enabling 2FA (e.g., API call)
    return { secret: 'mockSecret', otpauthUrl: 'mockOtpAuthUrl' }; // Mock response
  };

  const disableTwoFA = async (login: string) => {
    // Logic for disabling 2FA (e.g., API call)
    return {}; // Mock response
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        updateUserImage,
        updateUser,
        enableTwoFA,
        disableTwoFA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// User Component
const User: React.FC = () => {
  const { login: loginParam } = useParams<{ login: string }>();
  const {
    isLoggedIn,
    user,
    login,
    logout,
    updateUserImage,
    updateUser,
    enableTwoFA,
    disableTwoFA,
  } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [newPicture, setNewPicture] = useState<File | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if not authenticated
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

  const handleImageChange = async () => {
    if (!newPicture) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      try {
        const updatedUser = await updateUserImage(userData.login, base64Image);
        setUserData(updatedUser);
      } catch (error) {
        setError('Failed to update image');
      }
    };
    reader.readAsDataURL(newPicture);
  };

  const handleUsernameChange = async () => {
    if (!newUsername) return;
    try {
      const updatedUser = await updateUser(userData.login, {
        displayName: newUsername,
      });
      setUserData(updatedUser);
    } catch (error) {
      setError('Failed to update username');
    }
  };

  const handleTwoFAToggle = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTwoFAEnabled(event.target.checked);
    if (event.target.checked) {
      enableTwoFAForUser();
    } else {
      disableTwoFAForUser();
    }
  };

  const enableTwoFAForUser = async () => {
    try {
      const response = await enableTwoFA(userData.login);
      const qrCodeUrl = await qrcode.toDataURL(response.otpauthUrl);
      setQrCode(qrCodeUrl);
    } catch (error) {
      setError('Failed to enable 2FA');
    }
  };

  const disableTwoFAForUser = async () => {
    try {
      await disableTwoFA(userData.login);
      setQrCode(null);
    } catch (error) {
      setError('Failed to disable 2FA');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Card style={{ padding: '2rem', maxWidth: '400px', margin: '2rem auto' }}>
        <Typography variant="h4" gutterBottom>
          {isLoggedIn ? 'Profile' : 'Login'}
        </Typography>

        {!isLoggedIn && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => login()}
          >
            Login with 42 Intra
          </Button>
        )}

        {isLoggedIn && userData && (
          <Box>
            <Avatar
              src={userData.picture}
              alt="Profile"
              style={{ width: '100px', height: '100px' }}
            />
            {getLogin() === loginParam && (
              <>
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
                  style={{ marginTop: '1rem' }}
                >
                  Update Picture
                </Button>
              </>
            )}

            <Typography variant="h6">
              Username: {userData.displayName}
            </Typography>
            <Typography variant="h6">Login: {userData.login}</Typography>

            {getLogin() === loginParam && (
              <>
                <TextField
                  label="New Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  style={{ marginTop: '1rem' }}
                />
                <Button
                  onClick={handleUsernameChange}
                  disabled={!newUsername}
                  style={{ marginTop: '1rem' }}
                >
                  Update Username
                </Button>

                <FormControlLabel
                  control={
                    <Switch
                      checked={twoFAEnabled}
                      onChange={handleTwoFAToggle}
                      name="twoFAEnabled"
                      color="primary"
                    />
                  }
                  label="Enable 2FA"
                />

                {qrCode && (
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
              </>
            )}
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default User;
