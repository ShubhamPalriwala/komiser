import Image from 'next/image';
import formatNumber from '../../../../../utils/formatNumber';
import Button from '../../../../button/Button';
import ChevronRightIcon from '../../../../icons/ChevronRightIcon';
import { SlackAlert } from './hooks/useSlackAlerts';

type InventoryViewAlertsDisplayProps = {
  slackAlerts: SlackAlert[] | undefined;
  createOrEditSlackAlert: (alertId?: number | undefined) => void;
  incrementViewController: () => void;
};

function InventoryViewAlertsDisplay({
  slackAlerts,
  createOrEditSlackAlert,
  incrementViewController
}: InventoryViewAlertsDisplayProps) {
  return (
    <div className="flex flex-col gap-4">
      {slackAlerts?.map(alert => (
        <div
          onClick={() => createOrEditSlackAlert(alert.id)}
          key={alert.id}
          className="flex cursor-pointer select-none items-center justify-between rounded-lg border border-black-170 p-6 hover:border-black-200"
        >
          <div className="flex items-center gap-4">
            <Image
              src={alert.isSlack ? "/assets/img/others/slack.svg" : "/assets/img/others/custom-webhook.svg"}
              height={42}
              width={42}
              alt={alert.isSlack ? "Slack logo" : "Webhook logo"}
            />
            <div className="flex flex-col">
              <p className="font-semibold text-black-900">{alert.name}</p>
              <p className="text-xs text-black-400">
                {alert.budget
                  ? `When total cost is over $${formatNumber(
                    Number(alert.budget)
                  )}`
                  : `When cloud resources are over ${formatNumber(
                    Number(alert.usage)
                  )}`}
              </p>
            </div>
          </div>
          <ChevronRightIcon width={24} height={24} />
        </div>
      ))}
      <div className="self-end">
        <Button size="lg" onClick={incrementViewController}>
          Add alert
        </Button>
      </div>
    </div>
  );
}

export default InventoryViewAlertsDisplay;
