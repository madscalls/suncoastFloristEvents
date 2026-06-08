import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import StatusModal from "../../components/StatusModal";
import "./Wedding.css";

export default function WeddingForm() {
  const [modalStatus, setModalStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews] = useState([]);
  const { register, handleSubmit, watch } = useForm();
  const attachmentFiles = watch("attachments");

  useEffect(() => {
    if (!attachmentFiles || attachmentFiles.length === 0) {
      setPreviews([]);
      return;
    }

    const filePreviews = Array.from(attachmentFiles).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    setPreviews(filePreviews);

    return () => {
      filePreviews.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [attachmentFiles]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
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
      const response = await fetch("/api/submit-wedding", {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="wedding-page">
      <form className="wedding-form" onSubmit={handleSubmit(onSubmit)}>
        <section
          id="couple-info"
          className="wedding-section"
          aria-labelledby="couple-info-heading"
        >
          <h2 id="couple-info-heading">Couple Information</h2>
          <div className="input-grid">
            <label htmlFor="bride">
              Bride
              <input
                id="bride"
                type="text"
                {...register("bride", { required: true })}
              />
            </label>
            <label htmlFor="groom">
              Groom
              <input
                id="groom"
                type="text"
                {...register("groom", { required: true })}
              />
            </label>
            <label htmlFor="address">
              Address
              <input
                id="address"
                type="text"
                {...register("address", { required: true })}
              />
            </label>
            <label htmlFor="mobileNumber">
              Mobile number
              <input
                id="mobileNumber"
                type="tel"
                {...register("mobileNumber", {
                  required: true,
                  minLength: 6,
                  maxLength: 12,
                })}
              />
            </label>
            <label htmlFor="email">
              Email
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
              />
            </label>
          </div>
        </section>

        <section
          id="ceremony-details"
          className="wedding-section"
          aria-labelledby="ceremony-details-heading"
        >
          <h2 id="ceremony-details-heading">Ceremony & Timeline</h2>
          <div className="input-grid">
            <label htmlFor="ceremonyLocation">
              Ceremony Location
              <input
                id="ceremonyLocation"
                type="text"
                {...register("ceremonyLocation")}
              />
            </label>
            <label htmlFor="ceremonyAddress">
              Ceremony Address
              <input
                id="ceremonyAddress"
                type="text"
                {...register("ceremonyAddress")}
              />
            </label>
            <label htmlFor="weddingDate">
              Wedding Date
              <input
                id="weddingDate"
                type="datetime-local"
                {...register("weddingDate")}
              />
            </label>
            <label htmlFor="receptionLocation">
              Reception Location
              <input
                id="receptionLocation"
                type="text"
                {...register("receptionLocation")}
              />
            </label>
            <label htmlFor="rehearsalLocation">
              Rehearsal Location
              <input
                id="rehearsalLocation"
                type="text"
                {...register("rehearsalLocation")}
              />
            </label>
            <label htmlFor="rehearsalDate">
              Rehearsal Date
              <input
                id="rehearsalDate"
                type="date"
                {...register("rehearsalDate")}
              />
            </label>
            <label htmlFor="rehearsalTime">
              Rehearsal Time
              <input
                id="rehearsalTime"
                type="time"
                {...register("rehearsalTime")}
              />
            </label>
          </div>
        </section>

        <section
          id="attire-flowers"
          className="wedding-section"
          aria-labelledby="attire-flowers-heading"
        >
          <h2 id="attire-flowers-heading">Attire & Flowers</h2>
          <div className="input-grid">
            <label htmlFor="gownStyleColor">
              Bride's Gown Style & Color
              <input
                id="gownStyleColor"
                type="text"
                {...register("gownStyleColor")}
              />
            </label>
            <label htmlFor="bouquetDetails">
              Bouquet Details
              <input
                id="bouquetDetails"
                type="text"
                {...register("bouquetDetails")}
              />
            </label>
            <label htmlFor="priceRange">
              Price Range
              <input id="priceRange" type="text" {...register("priceRange")} />
            </label>
          </div>
        </section>

        <section
          id="wedding-party"
          className="wedding-section"
          aria-labelledby="wedding-party-heading"
        >
          <h2 id="wedding-party-heading">Wedding Party</h2>
          <div className="section-row">
            <div className="party-block">
              <h3>Bridal Party</h3>
              <label htmlFor="honorAttendantStyle">
                Honor Attendant Gown Style
                <input
                  id="honorAttendantStyle"
                  type="text"
                  {...register("honorAttendantStyle")}
                />
              </label>
              <label htmlFor="honorBouquetDetails">
                Honor Bouquet Details
                <input
                  id="honorBouquetDetails"
                  type="text"
                  {...register("honorBouquetDetails")}
                />
              </label>
              <label htmlFor="bridesmaidsCount">
                Bridesmaids Count
                <input
                  id="bridesmaidsCount"
                  type="number"
                  {...register("bridesmaidsCount")}
                />
              </label>
              <label htmlFor="bridesmaidGownStyle">
                Bridesmaid Gown Style
                <input
                  id="bridesmaidGownStyle"
                  type="text"
                  {...register("bridesmaidGownStyle")}
                />
              </label>
              <label htmlFor="bridesmaidBouquetDetails">
                Bridesmaid Bouquet Details
                <input
                  id="bridesmaidBouquetDetails"
                  type="text"
                  {...register("bridesmaidBouquetDetails")}
                />
              </label>
              <label htmlFor="flowerGirlBouquet">
                Flower Girl Bouquet
                <input
                  id="flowerGirlBouquet"
                  type="text"
                  {...register("flowerGirlBouquet")}
                />
              </label>
            </div>
            <div className="party-block">
              <h3>Groom's Party</h3>
              <label htmlFor="groomName">
                Groom
                <input id="groomName" type="text" {...register("groomName")} />
              </label>
              <label htmlFor="bestManDetails">
                Best Man / Groomsmen
                <input
                  id="bestManDetails"
                  type="text"
                  {...register("bestManDetails")}
                />
              </label>
              <label htmlFor="fathersDetails">
                Fathers / Grandfathers
                <input
                  id="fathersDetails"
                  type="text"
                  {...register("fathersDetails")}
                />
              </label>
              <label htmlFor="ringBearerDetails">
                Ring Bearer / Others
                <input
                  id="ringBearerDetails"
                  type="text"
                  {...register("ringBearerDetails")}
                />
              </label>
            </div>
          </div>
        </section>

        <section
          id="corsages"
          className="wedding-section"
          aria-labelledby="corsages-heading"
        >
          <h2 id="corsages-heading">Corsages & Family Attire</h2>
          <div className="input-grid">
            <label htmlFor="bridesMotherDress">
              Bride's Mother Dress
              <input
                id="bridesMotherDress"
                type="text"
                {...register("bridesMotherDress")}
              />
            </label>
            <label htmlFor="groomsMotherDress">
              Groom's Mother Dress
              <input
                id="groomsMotherDress"
                type="text"
                {...register("groomsMotherDress")}
              />
            </label>
            <label htmlFor="grandmothersCount">
              Grandmothers
              <input
                id="grandmothersCount"
                type="number"
                {...register("grandmothersCount")}
              />
            </label>
            <label htmlFor="otherCorsagesCount">
              Other Corsages
              <input
                id="otherCorsagesCount"
                type="number"
                {...register("otherCorsagesCount")}
              />
            </label>
          </div>
        </section>

        <section
          id="venue-reception"
          className="wedding-section"
          aria-labelledby="venue-reception-heading"
        >
          <h2 id="venue-reception-heading">Venue Plan</h2>
          <div className="section-row venue-blocks">
            <div className="venue-block">
              <h3>Ceremony</h3>
              <label htmlFor="mainAltar">
                Main Altar
                <input id="mainAltar" type="text" {...register("mainAltar")} />
              </label>
              <label htmlFor="aislePew">
                Aisle & Pew
                <input id="aislePew" type="text" {...register("aislePew")} />
              </label>
              <label htmlFor="ceremonyMisc">
                Misc
                <input
                  id="ceremonyMisc"
                  type="text"
                  {...register("ceremonyMisc")}
                />
              </label>
            </div>
            <div className="venue-block">
              <h3>Reception</h3>
              <label htmlFor="headTable">
                Head Table
                <input id="headTable" type="text" {...register("headTable")} />
              </label>
              <label htmlFor="cakeTable">
                Cake Table
                <input id="cakeTable" type="text" {...register("cakeTable")} />
              </label>
              <label htmlFor="centerpieces">
                Centerpieces
                <input
                  id="centerpieces"
                  type="text"
                  {...register("centerpieces")}
                />
              </label>
              <label htmlFor="receptionMisc">
                Misc
                <input
                  id="receptionMisc"
                  type="text"
                  {...register("receptionMisc")}
                />
              </label>
              <label htmlFor="receptionNotes">
                Notes
                <input
                  id="receptionNotes"
                  type="text"
                  {...register("receptionNotes")}
                />
              </label>
            </div>
          </div>
        </section>

        <section
          id="attachments"
          className="wedding-section"
          aria-labelledby="attachments-heading"
        >
          <h2 id="attachments-heading">Attachments</h2>
          <div className="input-grid">
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
          {previews.length > 0 && (
            <div className="file-preview-grid">
              {previews.map((file) => (
                <div key={file.id} className="file-preview">
                  {file.type.startsWith("image/") ? (
                    <img src={file.url} alt={file.name} />
                  ) : (
                    <span className="file-icon">📎</span>
                  )}
                  <span className="file-name">{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <button
          type="submit"
          className="wedding-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Submit Wedding Details"}
        </button>
      </form>

      {modalStatus && (
        <StatusModal type={modalStatus} onClose={() => setModalStatus(null)} />
      )}
    </main>
  );
}
