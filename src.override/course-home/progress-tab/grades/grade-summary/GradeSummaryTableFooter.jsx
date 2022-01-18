import React from 'react';
import { useSelector } from 'react-redux';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { DataTable } from '@edx/paragon';
import { useModel } from '../../../../generic/model-store';

import messages from '../messages';

function GradeSummaryTableFooter({ intl }) {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    courseGrade: {
      isPassing,
      visiblePercent,
    },
  } = useModel('progress', courseId);

  const statusColor = isPassing ? 'bg-success-100 text-success' : 'bg-warning-100 text-warning';
  const totalGrade = (visiblePercent * 100).toFixed(0);

  return (
    <DataTable.TableFooter className={`border-0 ${statusColor}`}>
      <div className="row w-100 m-0">
        <div id="weighted-grade-summary" className="col-8 pl-0">{intl.formatMessage(messages.weightedGradeSummary)}</div>
        <div data-testid="gradeSummaryFooterTotalWeightedGrade" aria-labelledby="weighted-grade-summary pr-0" className="col-4 text-right font-weight-bold">{totalGrade}%</div>
      </div>
    </DataTable.TableFooter>
  );
}

GradeSummaryTableFooter.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(GradeSummaryTableFooter);
