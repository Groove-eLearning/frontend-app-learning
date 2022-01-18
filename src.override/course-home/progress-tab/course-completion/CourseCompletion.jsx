import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import CompletionDonutChart from './CompletionDonutChart';
import messages from './messages';

function CourseCompletion({ intl }) {
  return (
    <section className="text-dark-700 mb-4 rounded border p-4">
      <div className="row">
        <div className="col-12 col-sm-6 col-md-7">
          <h2>{intl.formatMessage(messages.courseCompletion)}</h2>
          <p>
            {intl.formatMessage(messages.completionBody)}
          </p>
        </div>
        <div className="col-12 col-sm-6 col-md-5 text-center">
          <CompletionDonutChart />
        </div>
      </div>
    </section>
  );
}

CourseCompletion.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CourseCompletion);
