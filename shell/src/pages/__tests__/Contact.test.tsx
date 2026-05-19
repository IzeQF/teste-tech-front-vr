import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Contact from "../Contact";

describe("Contact", () => {
  it("renderiza o título Fale Conosco", () => {
    render(<Contact />);
    expect(screen.getByRole("heading", { name: /fale conosco/i })).toBeInTheDocument();
  });

  it("renderiza informações de contato", () => {
    render(<Contact />);
    expect(screen.getByText(/av\. paulista/i)).toBeInTheDocument();
    expect(screen.getByText(/contato@unistore/i)).toBeInTheDocument();
  });

  it("renderiza campos do formulário", () => {
    render(<Contact />);
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Mensagem")).toBeInTheDocument();
  });

  it("renderiza o botão de envio", () => {
    render(<Contact />);
    expect(screen.getByRole("button", { name: /enviar mensagem/i })).toBeInTheDocument();
  });

  it("preenche os campos do formulário", () => {
    render(<Contact />);
    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "João" } });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "joao@test.com" } });
    fireEvent.change(screen.getByLabelText("Mensagem"), { target: { value: "Olá!" } });
    expect(screen.getByLabelText("Nome")).toHaveValue("João");
    expect(screen.getByLabelText("E-mail")).toHaveValue("joao@test.com");
    expect(screen.getByLabelText("Mensagem")).toHaveValue("Olá!");
  });

  it("exibe mensagem de sucesso após envio", () => {
    render(<Contact />);
    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Maria" } });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "maria@test.com" } });
    fireEvent.change(screen.getByLabelText("Mensagem"), { target: { value: "Teste" } });
    fireEvent.click(screen.getByRole("button", { name: /enviar mensagem/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/mensagem enviada com sucesso/i);
    expect(screen.queryByRole("button", { name: /enviar mensagem/i })).not.toBeInTheDocument();
  });
});
