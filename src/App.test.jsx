import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App.jsx';

describe('App (modo demonstração)', () => {
  it('renderiza a tela de login quando não há sessão', () => {
    render(<App />);
    expect(screen.getByText('Que bom ter você aqui!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });
});