import classNames from 'classnames';
import Button from '../../../../button/Button';
import Grid from '../../../../grid/Grid';
import ArrowLeftIcon from '../../../../icons/ArrowLeftIcon';
import Input from '../../../../input/Input';
import { ToastProps } from '../../../../toast/hooks/useToast';
import useEditSlackAlerts from './hooks/useEditSlackAlerts';
import { AlertTypes, SlackAlert } from './hooks/useSlackAlerts';
import settingsService from '../../../../../services/settingsService';
import { useState } from 'react';
import LoadingSpinner from '../../../../icons/LoadingSpinner';

type InventoryViewAlertsEditSlackAlertProps = {
  alertType: AlertTypes;
  setViewControllerToAlertsBase: () => void;
  viewControllerOnClickingBackButton: () => void;
  deleteViewController: () => void;
  currentSlackAlert: SlackAlert | undefined;
  closeSlackAlert: (action?: 'hasChanges' | undefined) => void;
  viewId: number;
  setToast: (toast: ToastProps | undefined) => void;
};

function InventoryViewAlertsEditSlackAlert({
  alertType,
  setViewControllerToAlertsBase,
  viewControllerOnClickingBackButton,
  deleteViewController,
  currentSlackAlert,
  closeSlackAlert,
  viewId,
  setToast
}: InventoryViewAlertsEditSlackAlertProps) {
  const {
    selected,
    options,
    slackAlert,
    changeSlackAlertType,
    handleChange,
    buttonDisabled,
    submit,
    loading,
    deleteSlackAlert
  } = useEditSlackAlerts({
    alertType,
    currentSlackAlert,
    viewId,
    closeSlackAlert,
    setToast
  });

  const findWhichOption =
    currentSlackAlert &&
    options.find(option => option.type === currentSlackAlert.type);

  let alertName = alertType == 0 ? "Slack" : "Webhook";
  if (!currentSlackAlert) {
    if (alertName === "Webhook") {
      slackAlert.isSlack = false
    }
  }
  if (currentSlackAlert) {
    slackAlert.isSlack = currentSlackAlert.isSlack
    alertName = currentSlackAlert.isSlack ? "Slack" : "Webhook";
  }


  const testEndpoint = async () => {
    if (slackAlert.endpoint) {
      setTestingEndpoint(true);
      settingsService.testEndpoint(slackAlert.endpoint).then((data) => {
        setTestingEndpoint(false);
        setTestResultSuccess(data.success)
        setTestResultData({ success: data.success, message: data.message });

        setTimeout(() => {
          setTestResultSuccess(false)
        }, 3000)

      })
    } else {
      setTestResultData({ success: false, message: "Please type an endpoint above" });
    }
  };

  const [testingEndpoint, setTestingEndpoint] = useState(false);
  const [testResultData, setTestResultData] = useState<{ success: boolean, message: string }>();
  const [testResultSuccess, setTestResultSuccess] = useState<boolean>(false);


  return (
    <form
      onSubmit={e => {
        if (currentSlackAlert) {
          submit(e, setViewControllerToAlertsBase, 'edit',);
        } else {
          submit(e, setViewControllerToAlertsBase);
        }
      }}
      className="flex flex-col gap-6 text-sm"
    >
      {!currentSlackAlert && (
        <div
          onClick={() => viewControllerOnClickingBackButton()}
          className="flex cursor-pointer items-center gap-2 self-start text-black-900"
        >
          <ArrowLeftIcon width={24} height={24} />
          Setup {alertName} Alert
        </div>
      )}

      {/* Display a back button if editing a Slack alert */}
      {currentSlackAlert && (
        <div
          onClick={() => closeSlackAlert()}
          className="flex cursor-pointer items-center gap-2 self-start text-black-900"
        >
          <ArrowLeftIcon width={24} height={24} />
          Edit {currentSlackAlert.isSlack ? "Slack" : "Webhook"} alert
        </div>
      )}

      <div className="flex flex-col gap-4">
        <p className="text-black-400">Type</p>

        {/* Displaying the slack alert types when creating a new alert */}
        {!currentSlackAlert && (
          <Grid gap="sm">
            {options.map(option => {
              const isActive = selected === option.type;
              return (
                <div
                  key={option.label}
                  onClick={() => changeSlackAlertType(option.type)}
                  className={classNames(
                    'flex cursor-pointer flex-col items-start justify-center rounded-lg py-4 px-6 outline outline-black-200 hover:outline-black-300',
                    {
                      'outline-2 outline-primary hover:outline-primary': isActive
                    }
                  )}
                >
                  <div className="flex items-center gap-4">
                    <img src={option.image} alt={option.label} height={42} width={42} />
                    <div className="flex flex-col">
                      <p className="text-base font-semibold text-black-900">
                        {option.label}
                      </p>
                      <p className="text-xs text-black-400">{option.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Grid>
        )}

        {/* Displaying the chosen slack alert type when editing an alert */}
        {currentSlackAlert && (
          <div className="flex flex-col items-start justify-center">
            <p className="text-base font-semibold text-black-900">
              {findWhichOption?.label}
            </p>
            <p className="text-xs text-black-400">
              {findWhichOption?.description}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-black-400">Details</p>

        {selected === 'BUDGET' && (
          <Grid gap="sm">
            <Input
              label="Name"
              name="name"
              action={handleChange}
              value={slackAlert.name}
            />
            <Input
              type="number"
              label="Limit (in $)"
              name="budget"
              action={handleChange}
              value={slackAlert.budget}
              min={0}
              positiveNumberOnly
            />
          </Grid>
        )}

        {selected === 'USAGE' && (
          <Grid gap="sm">
            <Input
              label="Name"
              name="name"
              action={handleChange}
              value={slackAlert.name}
            />
            <Input
              type="number"
              label="Limit (of resources)"
              name="usage"
              action={handleChange}
              value={slackAlert.usage}
              min={0}
              positiveNumberOnly
            />
          </Grid>
        )}
      </div>
      {alertName === "Webhook" && (
        <div>
          <div className="flex flex-col gap-4">
            <p className="text-black-400">Output</p>
            <div className="relative">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    name="endpoint"
                    // style={{ paddingRight: "120px" }}

                    className={`peer w-full mr-6 rounded bg-white pl-4 pr-32 pt-[1.75rem] pb-[0.75rem] text-sm text-black-900 caret-primary outline outline-black-200 focus:outline-2 focus:outline-primary ${testResultData?.success === false && `outline-error-600 focus:outline-error-600`
                      }`}
                    placeholder=" "
                    onChange={e => {
                      {
                        handleChange({ ["endpoint"]: e.target.value });
                      }
                    }
                    }
                    value={slackAlert.endpoint}
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                  />
                  <span className="pointer-events-none absolute left-4 bottom-[1.925rem] origin-left scale-75 select-none font-normal text-black-300 transition-all peer-placeholder-shown:left-4 peer-placeholder-shown:bottom-[1.15rem] peer-placeholder-shown:scale-[87.5%] peer-focus:bottom-[1.925rem] peer-focus:scale-75">
                    Endpoint
                  </span>
                </div>
              </div>
              {/* <Input
                label="Endpoint"
                name="endpoint"
                action={handleChange}
                value={slackAlert.endpoint}
              /> */}
              <span
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer flex items-center gap-2 text-primary bg-transparent text-primary active:bg-komiser-200 active:text-primary rounded text-sm font-medium w-full sm:w-auto disabled:cursor-not-allowed ${testingEndpoint ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={testEndpoint}
              >
                {testingEndpoint ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-1 flex justify-center align-center">Test Endpoint</span>
                  </>
                ) : (
                  <>
                    {testResultSuccess &&
                      <img
                        src="/assets/img/others/tickmark.svg"
                        height={20}
                        width={20}
                        alt="tickmark"
                        className="-mr-1"
                      />
                    }

                    <span className={testResultSuccess ? "text-green-600" : ""}>{testResultSuccess ? "Valid Endpoint" : "Test Endpoint"}</span>
                  </>

                )}
              </span>

            </div>
            {testResultData?.success === false && (
              <p className="-mt-2 text-xs text-error-600">{testResultData.message}</p>
            )}

            <Input
              label="Secret (optional)"
              name="secret"
              action={handleChange}
              value={slackAlert.secret}
            // isError={!testResultData?.success}
            />
          </div>
          <div className="mt-2">
            <p className="text-xs text-black-400">
              We’ll send a POST request to the endpoint. More information can be found in our{" "}
              <a
                // TODO: update link when docs are ready
                href="https://docs.komiser.io/docs/introduction/getting-started/"
                target="_blank"
                rel="noreferrer"
                className="text-primary"
              >
                <u>developer documentation</u>
              </a>
              .
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          {/* Display a delete button if it's editing an alert */}
          {currentSlackAlert && (
            <Button
              size="lg"
              style="delete"
              onClick={deleteViewController}
            >
              Delete alert
            </Button>
          )}
        </div>

        <div className="flex gap-4">
          <Button style="ghost" size="lg" onClick={closeSlackAlert}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={buttonDisabled}
            loading={loading}
          >
            {currentSlackAlert ? 'Save changes' : 'Set up alert'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default InventoryViewAlertsEditSlackAlert;
