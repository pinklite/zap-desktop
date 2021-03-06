import React from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { SwitchButton } from 'components/UI'
import LayoutCards from 'components/Icon/LayoutCards'
import LayoutList from 'components/Icon/LayoutList'
import { CHANNEL_LIST_VIEW_MODE_SUMMARY, CHANNEL_LIST_VIEW_MODE_CARD } from './constants'
import messages from './messages'

const ChannelsViewButtons = ({ channelViewMode, setChannelViewMode, ...rest }) => {
  const intl = useIntl()
  const isCardView = channelViewMode === CHANNEL_LIST_VIEW_MODE_CARD
  return (
    <SwitchButton
      {...rest}
      data-hint={intl.formatMessage({
        ...(isCardView ? messages.view_mode_list : messages.view_mode_card),
      })}
      Icon1={LayoutList}
      Icon2={LayoutCards}
      isSwitched={isCardView}
      onClick={() =>
        setChannelViewMode(
          isCardView ? CHANNEL_LIST_VIEW_MODE_SUMMARY : CHANNEL_LIST_VIEW_MODE_CARD
        )
      }
    />
  )
}

ChannelsViewButtons.propTypes = {
  channelViewMode: PropTypes.string.isRequired,
  setChannelViewMode: PropTypes.func.isRequired,
}

export default ChannelsViewButtons
