import { useForm } from "react-hook-form";
import "./General.css";
import { useState } from "react";
import StatusModal from "../../components/StatusModal";

export default function GeneralForm() {
  const [modalStatus, setModalStatus] = useState(null); // null | "success" | "error"

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const attachments = watch("attachments");

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "attachments") {
        if (value && value.length) {
          Array.from(value).forEach((file) =>
            formData.append("attachments", file),
          );
        }
      } else {
        formData.append(key, value ?? "");
      }
    });

    try {
      const response = await fetch("/api/submit-general", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setModalStatus("success");
      } else {
        setModalStatus("error");
      }
    } catch (error) {
      console.error(error);
      setModalStatus("error");
    }
  };

  return (
    <main className="general-page">
      <form className="general-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="general-header">
          <h1>General Event Inquiry</h1>
          <p>
            Share a few details about your event and we’ll create a beautiful
            floral concept tailored to your celebration.
          </p>
        </div>

        <div className="general-grid">
          <label htmlFor="occasion">
            Occasion
            <input
              id="occasion"
              type="text"
              placeholder="Birthday, Anniversary, Graduation..."
              {...register("occasion", {
                required: "Please enter the occasion.",
              })}
            />
            {errors.occasion && (
              <span className="field-error">{errors.occasion.message}</span>
            )}
          </label>

          <label htmlFor="name">
            Name
            <input
              id="name"
              type="text"
              placeholder="Your name"
              {...register("name", { required: "Please enter your name." })}
            />
            {errors.name && (
              <span className="field-error">{errors.name.message}</span>
            )}
          </label>

          <label htmlFor="phone">
            Phone
            <input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              {...register("phone", {
                required: "Please enter a phone number.",
              })}
            />
            {errors.phone && (
              <span className="field-error">{errors.phone.message}</span>
            )}
          </label>

          <label htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Please enter your email.",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Please enter a valid email address.",
                },
              })}
            />
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </label>

          <label htmlFor="eventDate">
            Event Date
            <input id="eventDate" type="date" {...register("eventDate")} />
          </label>

          <label htmlFor="guestCount">
            Guest Count
            <input
              id="guestCount"
              type="number"
              min="1"
              placeholder="Approximate number"
              {...register("guestCount")}
            />
          </label>

          <label htmlFor="budget">
            Budget
            <input
              id="budget"
              type="text"
              placeholder="Budget range"
              {...register("budget")}
            />
          </label>

          <label htmlFor="attachments">
            Attach Files
            <input
              id="attachments"
              type="file"
              multiple
              {...register("attachments")}
            />
          </label>
        </div>

        {attachments && attachments.length > 0 && (
          <div className="file-list">
            <span>
              {attachments.length} file{attachments.length === 1 ? "" : "s"}{" "}
              selected
            </span>
            <ul>
              {Array.from(attachments).map((file) => (
                <li key={`${file.name}-${file.size}-${file.lastModified}`}>
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <label htmlFor="notes" className="full-width">
          Notes
          <textarea
            id="notes"
            placeholder="Tell us anything else about your event..."
            {...register("notes")}
          />
        </label>

        <button
          type="submit"
          className="general-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Request"}{" "}
        </button>
      </form>
      {modalStatus && (
        <StatusModal type={modalStatus} onClose={() => setModalStatus(null)} />
      )}
    </main>
  );
}
