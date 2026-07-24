import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

export default function LogoutButton() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="font-mono text-xs uppercase tracking-wide text-accent border border-accent px-3 py-1.5 hover:bg-accent hover:text-bg transition-colors"
        >
            Logout
        </button>
    );
}