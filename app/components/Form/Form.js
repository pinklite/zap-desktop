import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'components/UI'
import Pay from 'containers/Pay'
import Request from 'containers/Request'
import Channels from 'containers/Channels'

const Form = ({ formType, closeForm }) => {
  if (!formType) {
    return null
  }

  switch (formType) {
    case 'PAY_FORM':
      return (
        <Modal onClose={closeForm}>
          <Pay width={9 / 16} mx="auto" />
        </Modal>
      )

    case 'REQUEST_FORM':
      return (
        <Modal onClose={closeForm}>
          <Request width={9 / 16} mx="auto" />
        </Modal>
      )

    case 'CHANNELS':
      return (
        <Modal onClose={closeForm} mt={-3} mx={-4}>
          <Channels />
        </Modal>
      )
  }
}

Form.propTypes = {
  formType: PropTypes.string,
  closeForm: PropTypes.func.isRequired
}

export default Form
