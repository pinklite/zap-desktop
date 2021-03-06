import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'
import { FormattedMessage, FormattedTime, useIntl } from 'react-intl'
import copy from 'copy-to-clipboard'
import { Bar, DataRow, Button, QRCode, Text, Countdown } from 'components/UI'
import { CryptoSelector, CryptoValue, FiatSelector, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'
import RequestSettlePrompt from './RequestSettlePrompt'
import messages from './messages'
import { useIntlMap } from 'hooks'

const messageMap = [{ key: 'OPEN' }, { key: 'SETTLED' }, { key: 'CANCELED' }, { key: 'ACCEPTED' }]
const messageMapper = key => {
  const items = {
    OPEN: messages.not_paid,
    SETTLED: messages.settled,
    CANCELED: messages.cancelled,
    ACCEPTED: messages.paid,
  }
  return items[key]
}

const RequestSummary = ({
  cancelInvoice,
  clearSettleInvoiceError,
  settleInvoice,
  settleInvoiceError,
  invoice = {},
  showNotification,
  isHoldInvoiceEnabled,
  isInvoiceCancelling,
  isInvoiceSettling,
  ...rest
}) => {
  const {
    value: amountInSats,
    creationDate,
    expiryDate,
    fallbackAddr,
    isCancelled,
    isExpired,
    isKeysend,
    isSettled,
    isHoldInvoice,
    memo,
    paymentRequest,
    settleDate,
    state,
  } = invoice

  const [isNowExpired, setIsNowExpired] = useState(isExpired)
  const [isSettleDialogOpen, setIsSettleDialogOpen] = useState(false)

  const intl = useIntl()
  const stateMessages = useIntlMap(messageMap, messageMapper, intl)
  const stateDisplayNames = stateMessages.find(m => m.key === state)
  const stateDisplayName = stateDisplayNames ? stateDisplayNames.value : state

  const copyToClipboard = data => {
    copy(data)
    const notifBody = intl.formatMessage({ ...messages.address_copied_notification_description })
    showNotification(notifBody)
  }

  const getStatusColor = () => {
    if (isSettled) {
      return 'superGreen'
    }
    if (isCancelled || isNowExpired) {
      return 'superRed'
    }
    return 'superOrange'
  }

  const hasButtons = !isNowExpired && ['OPEN', 'ACCEPTED'].includes(state)

  return (
    <Box {...rest}>
      {isSettleDialogOpen && !isSettled && (
        <RequestSettlePrompt
          clearError={clearSettleInvoiceError}
          onCancel={() => setIsSettleDialogOpen(false)}
          onOk={settleInvoice}
          submitError={settleInvoiceError}
        />
      )}
      <DataRow
        left={<FormattedMessage {...messages.amount} />}
        right={
          <Flex alignItems="center">
            <CryptoSelector mr={2} />
            <CryptoValue fontSize="xxl" value={amountInSats} />
          </Flex>
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FormattedMessage {...messages.created} />}
        right={
          <FormattedTime day="2-digit" month="long" value={creationDate * 1000} year="numeric" />
        }
      />

      <Bar variant="light" />

      <DataRow
        left={<FormattedMessage {...messages.current_value} />}
        right={
          <Flex alignItems="center">
            <FiatSelector mr={2} />
            <FiatValue value={amountInSats} />
          </Flex>
        }
      />

      {memo && (
        <>
          <Bar variant="light" />
          <DataRow left={<FormattedMessage {...messages.memo} />} right={memo} />
        </>
      )}

      {fallbackAddr && (
        <>
          <Bar variant="light" />
          <DataRow
            left={<FormattedMessage {...messages.fallback_address} />}
            right={fallbackAddr}
          />
        </>
      )}

      <Bar variant="light" />

      <DataRow
        left={
          <>
            <FormattedMessage {...messages.payment_request} />
            {paymentRequest && (
              <>
                <Text
                  className="hint--bottom-left"
                  css="word-wrap: break-word;"
                  data-hint={paymentRequest}
                  fontSize="xs"
                  fontWeight="light"
                  mb={2}
                >
                  <Truncate maxlen={40} text={paymentRequest} />
                </Text>
                <Button onClick={() => copyToClipboard(paymentRequest)} size="small" type="button">
                  <FormattedMessage {...messages.copy_button_text} />
                </Button>
              </>
            )}
          </>
        }
        right={
          <Text>
            {isKeysend ? (
              <FormattedMessage {...messages.payment_request_keysend} />
            ) : (
              <QRCode value={paymentRequest.toUpperCase()} />
            )}
          </Text>
        }
      />

      <Bar variant="light" />

      <DataRow
        left={
          <>
            {hasButtons ? (
              <Flex alignItems="center">
                <Button
                  isDisabled={isInvoiceCancelling || isInvoiceSettling}
                  mr={2}
                  onClick={() => cancelInvoice(invoice.rHash)}
                  size="small"
                >
                  <FormattedMessage {...messages.cancel_button_text} />
                </Button>
                {isHoldInvoice && (
                  <Button
                    isDisabled={isInvoiceCancelling || isInvoiceSettling}
                    onClick={() => setIsSettleDialogOpen(true)}
                    size="small"
                  >
                    <FormattedMessage {...messages.settle_button_text} />
                  </Button>
                )}
              </Flex>
            ) : (
              <Text>
                <FormattedMessage {...messages.status} />
              </Text>
            )}
          </>
        }
        right={
          <Flex alignItems="center">
            <Box textAlign="right">
              {isSettled ? (
                <Text
                  color={getStatusColor()}
                  css="word-break: break-all; text-transform: capitalize;"
                  fontWeight="normal"
                  textAlign="right"
                >
                  <FormattedMessage {...messages.paid} />
                  <br />
                  <FormattedTime
                    day="2-digit"
                    month="long"
                    value={settleDate * 1000}
                    year="numeric"
                  />
                </Text>
              ) : (
                <Text color={getStatusColor()} fontWeight="light">
                  <>{stateDisplayName}</>
                  {!isCancelled && (
                    <Countdown
                      color={getStatusColor()}
                      countdownStyle="long"
                      isContinual={false}
                      offset={new Date(expiryDate * 1000)}
                      onExpire={() => setIsNowExpired(true)}
                    />
                  )}
                </Text>
              )}
            </Box>
          </Flex>
        }
      />
    </Box>
  )
}

RequestSummary.propTypes = {
  cancelInvoice: PropTypes.func.isRequired,
  clearSettleInvoiceError: PropTypes.func.isRequired,
  invoice: PropTypes.object.isRequired,
  isHoldInvoiceEnabled: PropTypes.bool,
  isInvoiceCancelling: PropTypes.bool,
  isInvoiceSettling: PropTypes.bool,
  settleInvoice: PropTypes.func.isRequired,
  settleInvoiceError: PropTypes.string,
  showNotification: PropTypes.func.isRequired,
}

export default RequestSummary
