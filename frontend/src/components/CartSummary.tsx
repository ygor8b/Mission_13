import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function CartSummary() {
  const { cartCount, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div
      className="card shadow-sm"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate('/cart')}
    >
      <div className="card-body d-flex align-items-center justify-content-between">
        <div>
          <strong>Cart</strong>
          <span className="badge bg-primary ms-2">{cartCount}</span>
        </div>
        <div className="text-end">
          <span className="text-muted">
            {cartCount} item{cartCount !== 1 ? 's' : ''}
          </span>
          <br />
          <strong>${cartTotal.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}

export default CartSummary;
