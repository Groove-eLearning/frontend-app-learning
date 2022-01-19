import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { layoutGenerator } from 'react-break';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { CheckCircle, Warning } from '@edx/paragon/icons';
import { Icon } from '@edx/paragon';
import { useModel } from '../../../../generic/model-store';

import GradeRangeTooltip from './GradeRangeTooltip';
import messages from '../messages';

function CourseGradeFooter({ intl, passingGrade }) {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    courseGrade: {
      isPassing,
      letterGrade,
    },
    gradingPolicy: {
      gradeRange,
    },
  } = useModel('progress', courseId);

  const layout = layoutGenerator({
    mobile: 0,
    tablet: 768,
  });

  const OnMobile = layout.is('mobile');
  const OnAtLeastTablet = layout.isAtLeast('tablet');

  const hasLetterGrades = Object.keys(gradeRange).length > 1; // A pass/fail course will only have one key
  let footerText = intl.formatMessage(messages.courseGradeFooterNonPassing, { passingGrade });

  if (isPassing) {
    if (hasLetterGrades) {
      const minGradeRangeCutoff = gradeRange[letterGrade] * 100;
      const possibleMaxGradeRangeValues = [...Object.values(gradeRange).filter(
        (grade) => (grade * 100 > minGradeRangeCutoff),
      )];
      const maxGradeRangeCutoff = possibleMaxGradeRangeValues.length ? Math.min(...possibleMaxGradeRangeValues) * 100
        : 100;

      footerText = intl.formatMessage(messages.courseGradeFooterPassingWithGrade, {
        letterGrade,
        minGrade: minGradeRangeCutoff.toFixed(0),
        maxGrade: maxGradeRangeCutoff.toFixed(0),
      });
    } else {
      footerText = intl.formatMessage(messages.courseGradeFooterGenericPassing);
    }
  }

  const icon = isPassing ? <Icon src={CheckCircle} className="d-inline-flex align-bottom" />
    : <Icon src={Warning} className="d-inline-flex align-bottom" />;

  return (
    <div className={`row w-100 m-0 px-3 py-2 py-md-3 rounded border ${isPassing ? 'text-success bg-success-100 border-success-500' : 'text-warning bg-warning-100 border-warning-500'}`}>
      <div className="col-auto p-0">
        {icon}
      </div>
      <div className="col-11 pr-0 pl-3">
        <OnMobile>
          <span className="align-bottom">
            {footerText}
            {hasLetterGrades && (
              <span style={{ whiteSpace: 'nowrap' }}>
                &nbsp;
                <GradeRangeTooltip iconButtonClassName="h4" passingGrade={passingGrade} />
              </span>
            )}
          </span>
        </OnMobile>
        <OnAtLeastTablet>
          <span className="m-0 align-bottom">
            {footerText}
            {hasLetterGrades && (
              <span style={{ whiteSpace: 'nowrap' }}>
                &nbsp;
                <GradeRangeTooltip iconButtonClassName="h3" passingGrade={passingGrade} />
              </span>
            )}
          </span>
        </OnAtLeastTablet>
      </div>
    </div>
  );
}

CourseGradeFooter.propTypes = {
  intl: intlShape.isRequired,
  passingGrade: PropTypes.number.isRequired,
};

export default injectIntl(CourseGradeFooter);
