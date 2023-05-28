import { ToastProps } from '../../../../toast/hooks/useToast';
import useSlackAlerts from './hooks/useSlackAlerts';
import InventoryViewAlertsDeleteAlert from './InventoryViewAlertsDeleteAlert';
import InventoryViewAlertsDisplay from './InventoryViewAlertsDisplay';
import InventoryViewAlertsEditSlackAlert from './InventoryViewAlertsEditSlackAlert';
import InventoryViewAlertsError from './InventoryViewAlertsError';
import InventoryViewAlertHasNoAlerts from './InventoryViewAlertsHasNoAlerts';
import InventoryViewNoAlertsDisplay from './InventoryViewAlertsHasNoAlerts';
import InventoryViewAlertHasNoSlackAlerts from './InventoryViewAlertsHasNoSlackAlerts';
import InventoryViewAlertHasNoSlackIntegration from './InventoryViewAlertsHasNoSlackIntegration';
import InventoryViewAlertsSkeleton from './InventoryViewAlertsSkeleton';
import InventoryViewSetupAlerts from './InventoryViewSetupAlerts';

type InventoryViewAlertsProps = {
  viewId: number;
  setToast: (toast: ToastProps | undefined) => void;
};

function InventoryViewAlerts({ viewId, setToast }: InventoryViewAlertsProps) {
  const {
    loading,
    error,
    hasAlerts,
    hasSlack,
    slackAlerts,
    // hasNoSlackAlerts,
    viewController,
    editSlackAlert,
    alertType,
    currentSlackAlert,
    setAlertTypeInViewController,
    setViewControllerToAlertsBase,
    setViewControllerToDeleteView,
    createOrEditSlackAlert,
    incrementViewController,
    decrementViewController,
    closeSlackAlert,
    fetchViewAlerts
  } = useSlackAlerts({ viewId });

  if (loading) return <InventoryViewAlertsSkeleton />;

  if (error)
    return <InventoryViewAlertsError fetchViewAlerts={fetchViewAlerts} />;

  // new1
  console.log(hasAlerts);
  console.log("viewContreoller value:", viewController);

  if (viewController === 0) {
    if (!hasAlerts) {
      return (
        <InventoryViewAlertHasNoAlerts
          incrementViewController={incrementViewController}
        />
      );
    }
    else {
      if (editSlackAlert) {
        return (
          <InventoryViewAlertsEditSlackAlert
            alertType={alertType}
            setViewControllerToAlertsBase={setViewControllerToAlertsBase}
            viewControllerOnClickingBackButton={setViewControllerToAlertsBase}
            deleteViewController={setViewControllerToDeleteView}
            currentSlackAlert={currentSlackAlert}
            closeSlackAlert={closeSlackAlert}
            viewId={viewId}
            setToast={setToast}
          />
        );
      }
      else {
        return (
          <InventoryViewAlertsDisplay
            slackAlerts={slackAlerts}
            createOrEditSlackAlert={createOrEditSlackAlert}
            incrementViewController={incrementViewController}
          />
        );
      }

    }
  } else if (viewController === 1) {
    return (
      <InventoryViewSetupAlerts
        setAlertTypeInViewController={setAlertTypeInViewController}
        decrementViewController={decrementViewController}
        isSlackConfigured={hasSlack}
      />
    );

  } else if (viewController == 2) {
    return (
      <InventoryViewAlertsEditSlackAlert
        alertType={alertType}
        setViewControllerToAlertsBase={setViewControllerToAlertsBase}
        viewControllerOnClickingBackButton={decrementViewController}
        deleteViewController={incrementViewController}
        currentSlackAlert={currentSlackAlert}
        closeSlackAlert={closeSlackAlert}
        viewId={viewId}
        setToast={setToast}
      />
    );
  } else if (viewController == 3) {
    return (
      <InventoryViewAlertsDeleteAlert
        alertType={alertType}
        viewControllerOnCancelButton={decrementViewController}
        currentSlackAlert={currentSlackAlert}
        closeSlackAlert={closeSlackAlert}
        viewId={viewId}
        setToast={setToast}
      />
    );

  }

}

export default InventoryViewAlerts;
