import Image from 'next/image';
import Button from '../../../../button/Button';
import { AlertTypes, SlackAlert } from './hooks/useSlackAlerts';
import useEditSlackAlerts from './hooks/useEditSlackAlerts';
import { ToastProps } from '../../../../toast/hooks/useToast';

type InventoryViewAlertsDeleteAlert = {
    alertType: AlertTypes;
    closeSlackAlert: (action?: 'hasChanges' | undefined) => void;
    viewId: number;
    setToast: (toast: ToastProps | undefined) => void;
    viewControllerOnCancelButton: () => void;
    currentSlackAlert: SlackAlert | undefined;

};

function InventoryViewAlertsDeleteAlert({
    alertType,
    viewId,
    closeSlackAlert,
    setToast,
    viewControllerOnCancelButton,
    currentSlackAlert
}: InventoryViewAlertsDeleteAlert) {
    const {
        deleteSlackAlert,
        loading
    } = useEditSlackAlerts({
        alertType,
        currentSlackAlert,
        viewId,
        closeSlackAlert,
        setToast
    });
    return (
        <div className="rounded-lg p-6 bg-komiser-100">
            <div className="flex flex-col items-center gap-6">
                <Image
                    src="/assets/img/others/warning.svg"
                    alt="Purplin"
                    width={48}
                    height={48}
                    className="flex-shrink-0 mx-auto"
                />
                <div className="flex flex-col items-center gap-2 px-4 mb-8">
                    <p className="font-semibold text-black-900 text-center">
                        Are you sure you want to delete this alert?
                    </p>
                    <p className="text-sm text-black-400 text-center">
                        By deleting the “{currentSlackAlert?.name}”{" "}
                        {currentSlackAlert?.isSlack ? "slack" : "webhook"} alert, you won’t
                        receive any more notifications regarding the cost limit you set up.
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-end">
                <div className="flex gap-4">
                    <Button style="ghost" size="lg" onClick={viewControllerOnCancelButton}>
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        style="delete"
                        type="button"
                        onClick={() => {
                            viewControllerOnCancelButton();
                            if (currentSlackAlert) {
                                deleteSlackAlert(currentSlackAlert.id);
                            }
                        }}
                        loading={loading}
                    >
                        Delete alert
                    </Button>
                </div>
            </div>
        </div >);
}

export default InventoryViewAlertsDeleteAlert;
