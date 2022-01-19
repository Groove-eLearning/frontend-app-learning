import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';

import Footer from '@edx/frontend-component-footer';
import { Toast } from '@edx/paragon';
import { LearningHeader as Header } from '@edx/frontend-component-header';
import PageLoading from '../generic/PageLoading';
import { getAccessDeniedRedirectUrl } from '../shared/access';
import { useModel } from '../generic/model-store';

import genericMessages from '../generic/messages';
import messages from './messages';
import LoadedTabPage from './LoadedTabPage';
import { setCallToActionToast } from '../course-home/data/slice';

function TabPage({ intl, ...props }) {
  const {
    activeTabSlug,
    courseId,
    courseStatus,
    metadataModel,
    unitId,
  } = props;
  const {
    toastBodyLink,
    toastBodyText,
    toastHeader,
  } = useSelector(state => state.courseHome);
  const dispatch = useDispatch();
  const {
    courseAccess,
    number,
    org,
    start,
    title,
  } = useModel(metadataModel, courseId);

  if (courseStatus === 'loading') {
    return (
      <div className="d-flex flex-column vh-100">
        <Header />
        <div className="overflow-auto flex-grow-1 d-flex flex-column h-0">
          <div className="flex-grow-1">
            <PageLoading
              srMessage={intl.formatMessage(messages.loading)}
            />
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  if (courseStatus === 'denied') {
    const redirectUrl = getAccessDeniedRedirectUrl(courseId, activeTabSlug, courseAccess, start, unitId);
    if (redirectUrl) {
      return (<Redirect to={redirectUrl} />);
    }
  }

  // Either a success state or a denied state that wasn't redirected above (some tabs handle denied states themselves,
  // like the outline tab handling unenrolled learners)
  if (courseStatus === 'loaded' || courseStatus === 'denied') {
    return (
      <div className="d-flex flex-column vh-100">
        <Toast
          action={toastBodyText ? {
            label: toastBodyText,
            href: toastBodyLink,
          } : null}
          closeLabel={intl.formatMessage(genericMessages.close)}
          onClose={() => dispatch(setCallToActionToast({ header: '', link: null, link_text: null }))}
          show={!!(toastHeader)}
        >
          {toastHeader}
        </Toast>
        <Header
          courseOrg={org}
          courseNumber={number}
          courseTitle={title}
        />
        <div className="overflow-auto flex-grow-1 d-flex flex-column h-0">
          <div className="flex-grow-1">
            <LoadedTabPage {...props} />
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  // courseStatus 'failed' and any other unexpected course status.
  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <div className="overflow-auto flex-grow-1 d-flex flex-column h-0">
        <div className="flex-grow-1">
          <p className="text-center py-5 mx-auto" style={{ maxWidth: '30em' }}>
            {intl.formatMessage(messages.failure)}
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}

TabPage.defaultProps = {
  courseId: null,
  unitId: null,
};

TabPage.propTypes = {
  activeTabSlug: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string,
  courseStatus: PropTypes.string.isRequired,
  metadataModel: PropTypes.string.isRequired,
  unitId: PropTypes.string,
};

export default injectIntl(TabPage);
