import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Info {
  remaining: {
    title: string;
    color: string;
    startDay: number;
  };
  warning: {
    title: string;
    color: string;
    startDay: number;
  };
  completed: {
    title: string;
    color: string;
  };
  expire: {
    title: string;
    color: string;
    startDay: number;
  };
}
interface CountdownProps {
  targetDate: Date;
  feedbackDate: Date | null;
  info: Info;
  className?: string;
}

const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  feedbackDate,
  className,
  info,
}) => {
  const { t } = useTranslation();
  const [timeDifference, setTimeDifference] = useState(() =>
    calculateTimeDifference(targetDate, feedbackDate, info)
  );
  const title = timeDifference.elapsed.complete
    ? info.completed.title
    : timeDifference.elapsed.remaining
    ? info.remaining.title
    : timeDifference.elapsed.warning
    ? info.warning.title
    : info.expire.title;
  const backgroundColor = timeDifference.elapsed.complete
    ? info.completed.color
    : timeDifference.elapsed.remaining
    ? info.remaining.color
    : timeDifference.elapsed.warning
    ? info.warning.color
    : info.expire.color;

  useEffect(() => {
    if (feedbackDate == null) {
      const interval = setInterval(() => {
        setTimeDifference(
          calculateTimeDifference(targetDate, feedbackDate, info)
        );
      }, 60000); // Update every minute

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [targetDate]);

  return (
    <div
      className={cn(
        `flex flex-col items-center select-none ${backgroundColor}`,
        className
      )}
    >
      <h2
        className={`ltr:text-lg-ltr md:ltr:text-xl-ltr font-semibold text-primary-foreground uppercase mb-2`}
      >
        {title}
      </h2>
      <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-2">
        <h1 className="ltr:text-md-ltr md:ltr:text-lg-ltr font-semibold rounded-md text-center w-fit text-primary-foreground">
          {t("days")}
        </h1>
        <h1 className="ltr:text-md-ltr md:ltr:text-lg-ltr font-semibold rounded-md text-center w-fit text-primary-foreground">
          {t("hours")}
        </h1>
        <h1 className="ltr:text-md-ltr md:ltr:text-lg-ltr font-semibold rounded-md text-center w-fit text-primary-foreground">
          {t("minutes")}
        </h1>
        <h1
          className={`ltr:text-xl-ltr md:ltr:text-2xl-ltr font-semibold text-primary/95 shadow bg-card py-2 px-3 rounded-md text-center w-fit`}
        >
          {timeDifference.days}
        </h1>
        <h1
          className={`ltr:text-xl-ltr md:ltr:text-2xl-ltr font-semibold text-primary/95 shadow bg-card py-2 px-3 rounded-md text-center w-fit`}
        >
          {timeDifference.hours}
        </h1>
        <h1
          className={`ltr:text-xl-ltr md:ltr:text-2xl-ltr font-semibold text-primary/95 shadow bg-card py-2 px-3 rounded-md text-center w-fit`}
        >
          {timeDifference.minutes}
        </h1>
      </div>
    </div>
  );
};

function calculateTimeDifference(
  targetDate: Date,
  feedbackDate: Date | null,
  info: Info
) {
  const now = new Date();
  const compareTime =
    feedbackDate != null ? feedbackDate.getTime() : now.getTime();
  const diff = targetDate.getTime() - compareTime;
  // const isFuture = diff >= 0;
  const absDiff = Math.abs(diff);

  let days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const elapsed = {
    remaining: false,
    warning: false,
    expire: false,
    complete: false,
  };
  if (feedbackDate != null) {
    elapsed.complete = true;
  } else if (days >= info.remaining.startDay) {
    elapsed.remaining = true;
  } else if (days <= info.warning.startDay && days >= info.expire.startDay) {
    elapsed.warning = true;
  } else {
    elapsed.expire = true;
  }
  const hours = Math.floor(
    (absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

  // days = isFuture ? days : -days;
  return { elapsed, days, hours, minutes };
}

export default Countdown;
