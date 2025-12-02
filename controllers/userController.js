import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Obtener perfil
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Actualizar perfil (nombre, email, y opcional cambio de password)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verifica que el usuario que hace la petición es el mismo del token
    if (req.user.id !== req.params.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
