let thumbpress_modal = ( show = true ) => {
	if(show) {
		jQuery('#image-sizes-modal').show();
	}
	else {
		jQuery('#image-sizes-modal').hide();
	}
}

jQuery(function ($) {

	$('#image-sizes_report-copy').click(function(e) {
		e.preventDefault();
		$('#image-sizes_tools-report').select();

		try {
			var successful = document.execCommand('copy');
			if( successful ){
				$(this).html('<span class="dashicons dashicons-saved"></span>');
			}
		} catch (err) {
			console.log('Oops, unable to copy!');
		}
	});

	$(".image-sizes-help-heading").click(function (e) {
		var $this = $(this);
		var target = $this.data("target");
		$(".image-sizes-help-text:not(" + target + ")").slideUp();
		if ($(target).is(":hidden")) {
			$(target).slideDown();
		} else {
			$(target).slideUp();
		}
	});

	// enable/disable
	var chk_all = $(".check-all");
	var chk_def = $(".check-all-default");
	var chk_cst = $(".check-all-custom");

	chk_all.change(function () {
		$(".check-all-default,.check-all-custom").prop("checked", this.checked).change();
	});

	chk_def.change(function () {
		$(".check-default").prop("checked", this.checked);
		$(".check-this").change();
	});

	chk_cst.change(function () {
		$(".check-custom").prop("checked", this.checked);
		$(".check-this").change();
	});

	$(".check-this").change(function (e) {
		var total = $(".check-this").length;
		var enabled = $(".check-this:not(:checked)").length;
		var disabled = $(".check-this:checked").length;

		$("#disabled-counter .counter").text(disabled);
		$("#enabled-counter .counter").text(enabled);
	}).change();

	var limit = $("#image-sizes_regenerate-thumbs-limit").val();

	$("#image-sizes_regenerate-thumbs-limit").bind("keyup mouseup", function () {
		limit = $(this).val();
	});


	var offset = 0;
	var thumbs_deleted = 0;
	var thumbs_created = 0;

	function regenerate(limit, offset, thumbs_deleted, thumbs_created) {
		$.ajax({
			url: THUMBPRESS.ajaxurl,
			type: "POST",
			data: {
				action: "image_sizes-regen-thumbs",
				offset: offset,
				limit: limit,
				thumbs_deleteds: thumbs_deleted,
				thumbs_createds: thumbs_created,
				_nonce: THUMBPRESS.nonce,
			},
			success: function (res) {
				if (res.has_image) {
					var progress = (res.offset / res.total_images_count) * 100;
					$(".image-sizes-progress-content").text(Math.ceil(progress) + "%").css({ width: progress + "%" });

					regenerate(limit, res.offset, res.thumbs_deleted, res.thumbs_created);
				} else {
					$("#image_sizes-regen-thumbs").text(THUMBPRESS.regen).attr("disabled", false);
					$(".image-sizes-progress-panel .image-sizes-progress-content").addClass("progress-full");
				}
				$("#image_sizes-message").html(res.message).show();
			},
			error: function (err) {
				$("#image_sizes-regen-thumbs").text(THUMBPRESS.regen).attr("disabled", false);
			},
		});
	}

	// cx-regen-thumbs
	$("#image_sizes-regen-thumbs").click(function (e) {
		$("#image_sizes-regen-thumbs").text(THUMBPRESS.regening).attr("disabled", true);
		$("#image_sizes-message").html("").hide();
		$(".image-sizes-progress-panel").hide();

		regenerate(limit, offset, thumbs_deleted, thumbs_created);

		$("#image_sizes-message").before('<div class="image-sizes-progress-panel"><div class="image-sizes-progress-content" style="width:0%"><span>0%</span></div></div></div>');
	});

	// dismiss
	$(".image_sizes-dismiss").click(function (e) {
		var $this = $(this);
		$this.parent().slideToggle();
		$.ajax({
			url: THUMBPRESS.ajaxurl,
			data: {
				action: "image_sizes-dismiss",
				meta_key: $this.data("meta_key"),
				_nonce: THUMBPRESS.nonce,
			},
			type: "GET",
			success: function (res) {
				console.log(res);
			},
			error: function (err) {
				console.log(err);
			},
		});
	});

	$("#image_sizes-regen-wrap span").click(function (e) {
		alert($(this).attr("title"));
	});

	$(document).on("click", "#cx-optimized", function (e) {
		$("#cx-nav-label-image-sizes_optimize").trigger("click");
	});

	init_draggable($(".draggable-item"));

	$("#sortable2").sortable({
		connectWith: "#sortable1, #sortable2",
		items: ".draggable-item, .sortable-item",
		start: function (event, ui) {
			$("#sortable1").sortable("enable");
			$("ul.image_sizes-sortable.disable li input").attr("name", "disables[]");

			var _length = $("ul.image_sizes-sortable.disable li").length - 1;
			$(".image_sizes-default-thumbnails-panel h4 .disables-count").text(
				_length
				);

			var _length = $("ul.image_sizes-sortable.enable li").length;
			$(".image_sizes-default-thumbnails-panel h4 .enables-count").text(
				_length
				);
		},
		receive: function (event, ui) {
			if (ui.item.hasClass("ui-draggable")) {
				ui.item.draggable("destroy");
			}
		},
	});

	$("#sortable1").sortable({
		connectWith: "#sortable1, #sortable2",
		items: ".draggable-item, .sortable-item",
		receive: function (event, ui) {
			$("#sortable1").sortable("disable");
			var widget = ui.item;
			init_draggable(widget);
			$("ul.image_sizes-sortable.enable li input").attr("name", "");

			var _length = $("ul.image_sizes-sortable.disable li").length;
			$(".image_sizes-default-thumbnails-panel h4 .disables-count").text(_length);

			var _length = $("ul.image_sizes-sortable.enable li").length;
			$(".image_sizes-default-thumbnails-panel h4 .enables-count").text(_length);
		},
	});

	function init_draggable(widget) {
		widget.draggable({
			connectToSortable: "#sortable2",
			stack: ".draggable-item",
			revert: true,
			revertDuration: 200,
			start: function (event, ui) {
				$("#sortable1").sortable("disable");
			},
		});
	}
});
