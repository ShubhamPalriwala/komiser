import { useEffect, useState } from 'react';
import settingsService from '../../../../../../services/settingsService';

type useSlackAlertsProps = {
  viewId: number;
};

export type SlackAlert = {
  id: number;
  name: string;
  viewId: string;
  type: 'BUDGET' | 'USAGE';
  budget?: number | string;
  usage?: number | string;
  isSlack: boolean;
  endpoint?: string;
  secret?: string;
};

export enum AlertTypes {
  "SLACK", "WEBHOOK"
}

function useSlackAlerts({ viewId }: useSlackAlertsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasSlack, setHasSlack] = useState(false);
  const [hasAlerts, setHasAlerts] = useState(false);
  const [slackAlerts, setSlackAlerts] = useState<SlackAlert[]>();
  const [editSlackAlert, setEditSlackAlert] = useState(false);
  const [currentSlackAlert, setCurrentSlackAlert] = useState<SlackAlert>();
  const [viewController, setviewController] = useState(0);
  const [alertType, setAlertType] = useState<AlertTypes>(AlertTypes.SLACK);

  function fetchSlackStatus() {
    if (!loading) {
      setLoading(true);
    }

    if (error) {
      setError(false);
    }

    settingsService.getExistingAlertsPresence().then(res => {
      if (res === Error) {
        setLoading(false);
        setError(true);
      } else {
        setLoading(false);
        setHasAlerts(res.present);
      }
    })

    settingsService.getSlackIntegration().then(res => {
      if (res === Error) {
        setLoading(false);
        setError(true);
      } else {
        setLoading(false);
        setHasSlack(res.enabled);
      }
    });
  }

  function fetchViewAlerts() {
    if (!loading) {
      setLoading(true);
    }

    if (error) {
      setError(false);
    }

    settingsService.getSlackAlertsFromAView(viewId).then(res => {
      if (res === Error) {
        setLoading(false);
        setError(true);
      } else {
        setLoading(false);
        if (res.length > 0) setHasAlerts(true)
        else setHasAlerts(false)
        setSlackAlerts(res);
      }
    });
  }

  function incrementViewController() {
    setviewController(viewController + 1)
  }

  function decrementViewController() {
    setviewController(viewController - 1)
  }

  function setViewControllerToAlertsBase() {
    setviewController(0)
  }

  function setViewControllerToDeleteView() {
    setEditSlackAlert(false)
    setviewController(3)
  }


  function setAlertTypeInViewController(alertName: AlertTypes) {
    incrementViewController()
    setAlertType(alertName)
  }

  function createOrEditSlackAlert(alertId?: number) {
    if (alertId && slackAlerts) {
      const foundSlackAlert = slackAlerts.find(alert => alert.id === alertId);

      if (foundSlackAlert) {
        setCurrentSlackAlert(foundSlackAlert);
      }
    }
    setEditSlackAlert(true);
  }

  function closeSlackAlert(action?: 'hasChanges') {
    setCurrentSlackAlert(undefined);
    setEditSlackAlert(false);
    setViewControllerToAlertsBase()

    if (action === 'hasChanges') {
      fetchViewAlerts();
    }
  }

  useEffect(() => {
    if (!hasAlerts) {
      fetchSlackStatus();
    }

    if (hasAlerts && viewId) {
      fetchViewAlerts();
    }
  }, [hasAlerts]);

  return {
    loading,
    error,
    hasAlerts,
    hasSlack,
    slackAlerts,
    editSlackAlert,
    currentSlackAlert,
    viewController,
    alertType,
    createOrEditSlackAlert,
    setViewControllerToAlertsBase,
    setViewControllerToDeleteView,
    closeSlackAlert,
    fetchViewAlerts,
    setAlertTypeInViewController,
    decrementViewController,
    incrementViewController,
  };
}

export default useSlackAlerts;
