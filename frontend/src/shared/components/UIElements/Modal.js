import React from "react";
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";
import { createPortal } from "react-dom";

import "./Modal.css";

const ModalOverlay = (props) => {
  // is its own component because it uses a portal
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <div className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </div>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );

  return createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </>
  );
};

export default Modal;
